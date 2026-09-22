SET XACT_ABORT ON;
SET NOCOUNT ON;

BEGIN TRANSACTION;

IF NOT EXISTS (SELECT 1 FROM sys.schemas WHERE name = N'billing')
    EXEC(N'CREATE SCHEMA billing');

IF OBJECT_ID(N'billing.schema_migration', N'U') IS NULL
BEGIN
    CREATE TABLE billing.schema_migration (
        version_no int NOT NULL CONSTRAINT PK_billing_schema_migration PRIMARY KEY,
        description nvarchar(200) NOT NULL,
        applied_at datetime2(3) NOT NULL CONSTRAINT DF_billing_schema_migration_applied_at DEFAULT SYSUTCDATETIME()
    );
END;

IF EXISTS (SELECT 1 FROM billing.schema_migration WHERE version_no = 1)
BEGIN
    COMMIT TRANSACTION;
    RETURN;
END;

CREATE TABLE billing.contract (
    contract_id bigint NOT NULL CONSTRAINT PK_billing_contract PRIMARY KEY,
    contract_number nvarchar(80) NOT NULL,
    supplier_name nvarchar(240) NOT NULL,
    subject nvarchar(1000) NOT NULL,
    effective_from date NOT NULL,
    effective_to date NOT NULL,
    global_value_cents bigint NOT NULL,
    billing_frequency varchar(20) NOT NULL,
    invoice_deadline_day tinyint NOT NULL,
    payment_day tinyint NOT NULL,
    status varchar(10) NOT NULL,
    concurrency_token rowversion NOT NULL,
    CONSTRAINT UQ_billing_contract_number UNIQUE (contract_number),
    CONSTRAINT CK_billing_contract_dates CHECK (effective_to >= effective_from),
    CONSTRAINT CK_billing_contract_value CHECK (global_value_cents >= 0),
    CONSTRAINT CK_billing_contract_frequency CHECK (billing_frequency IN ('MENSAL', 'POR_EVENTO', 'SOB_DEMANDA')),
    CONSTRAINT CK_billing_contract_invoice_day CHECK (invoice_deadline_day BETWEEN 1 AND 31),
    CONSTRAINT CK_billing_contract_payment_day CHECK (payment_day BETWEEN 1 AND 31),
    CONSTRAINT CK_billing_contract_status CHECK (status IN ('ATIVO', 'INATIVO'))
);

CREATE TABLE billing.service_unit (
    service_unit_id bigint NOT NULL CONSTRAINT PK_billing_service_unit PRIMARY KEY,
    contract_id bigint NOT NULL,
    code nvarchar(80) NOT NULL,
    description nvarchar(300) NOT NULL,
    object_type varchar(30) NOT NULL,
    city nvarchar(160) NULL,
    state_code char(2) NULL,
    is_active bit NOT NULL,
    CONSTRAINT FK_billing_service_unit_contract FOREIGN KEY (contract_id) REFERENCES billing.contract(contract_id),
    CONSTRAINT UQ_billing_service_unit_code UNIQUE (contract_id, code)
);

CREATE TABLE billing.billable_item (
    billable_item_id bigint NOT NULL CONSTRAINT PK_billing_billable_item PRIMARY KEY,
    contract_id bigint NOT NULL,
    service_unit_id bigint NULL,
    code nvarchar(80) NOT NULL,
    description nvarchar(300) NOT NULL,
    object_type varchar(30) NOT NULL,
    unit_of_measure nvarchar(40) NOT NULL,
    unit_value_cents bigint NOT NULL,
    monthly_value_cents bigint NOT NULL,
    contracted_quantity decimal(19,6) NOT NULL,
    allows_pro_rata bit NOT NULL,
    allows_retention bit NOT NULL,
    effective_from date NOT NULL,
    effective_to date NULL,
    is_active bit NOT NULL,
    CONSTRAINT FK_billing_billable_item_contract FOREIGN KEY (contract_id) REFERENCES billing.contract(contract_id),
    CONSTRAINT FK_billing_billable_item_unit FOREIGN KEY (service_unit_id) REFERENCES billing.service_unit(service_unit_id),
    CONSTRAINT UQ_billing_billable_item_code UNIQUE (contract_id, code),
    CONSTRAINT CK_billing_billable_item_values CHECK (unit_value_cents >= 0 AND monthly_value_cents >= 0 AND contracted_quantity >= 0),
    CONSTRAINT CK_billing_billable_item_dates CHECK (effective_to IS NULL OR effective_to >= effective_from)
);

CREATE TABLE billing.billing_rule (
    billing_rule_id bigint NOT NULL CONSTRAINT PK_billing_rule PRIMARY KEY,
    contract_id bigint NOT NULL,
    billable_item_id bigint NULL,
    name nvarchar(240) NOT NULL,
    rule_type varchar(30) NOT NULL,
    trigger_event varchar(30) NULL,
    calculation_base varchar(30) NOT NULL,
    percentage decimal(12,6) NULL,
    fixed_value_cents bigint NULL,
    transition_factor decimal(19,8) NULL,
    application_order int NOT NULL,
    effective_from date NOT NULL,
    effective_to date NULL,
    is_active bit NOT NULL,
    CONSTRAINT FK_billing_rule_contract FOREIGN KEY (contract_id) REFERENCES billing.contract(contract_id),
    CONSTRAINT FK_billing_rule_item FOREIGN KEY (billable_item_id) REFERENCES billing.billable_item(billable_item_id),
    CONSTRAINT CK_billing_rule_order CHECK (application_order > 0),
    CONSTRAINT CK_billing_rule_dates CHECK (effective_to IS NULL OR effective_to >= effective_from)
);

CREATE TABLE billing.sla_indicator (
    sla_indicator_id bigint NOT NULL CONSTRAINT PK_billing_sla_indicator PRIMARY KEY,
    contract_id bigint NOT NULL,
    code nvarchar(80) NOT NULL,
    name nvarchar(240) NOT NULL,
    assessment_unit varchar(20) NOT NULL,
    target decimal(19,8) NOT NULL,
    calculation_base varchar(30) NOT NULL,
    rule_type varchar(20) NOT NULL,
    percentage decimal(12,6) NULL,
    percentage_cap decimal(12,6) NULL,
    effective_from date NOT NULL,
    effective_to date NULL,
    is_active bit NOT NULL,
    CONSTRAINT FK_billing_sla_indicator_contract FOREIGN KEY (contract_id) REFERENCES billing.contract(contract_id),
    CONSTRAINT UQ_billing_sla_indicator_code UNIQUE (contract_id, code),
    CONSTRAINT CK_billing_sla_indicator_cap CHECK (percentage_cap IS NULL OR percentage_cap BETWEEN 0 AND 100),
    CONSTRAINT CK_billing_sla_indicator_dates CHECK (effective_to IS NULL OR effective_to >= effective_from)
);

CREATE TABLE billing.sla_band (
    sla_band_id bigint NOT NULL CONSTRAINT PK_billing_sla_band PRIMARY KEY,
    sla_indicator_id bigint NOT NULL,
    minimum_value decimal(19,8) NOT NULL,
    maximum_value decimal(19,8) NOT NULL,
    discount_percentage decimal(12,6) NOT NULL,
    display_order int NOT NULL,
    CONSTRAINT FK_billing_sla_band_indicator FOREIGN KEY (sla_indicator_id) REFERENCES billing.sla_indicator(sla_indicator_id),
    CONSTRAINT UQ_billing_sla_band_order UNIQUE (sla_indicator_id, display_order),
    CONSTRAINT CK_billing_sla_band_range CHECK (maximum_value >= minimum_value),
    CONSTRAINT CK_billing_sla_band_discount CHECK (discount_percentage BETWEEN 0 AND 100)
);

CREATE TABLE billing.penalty_rule (
    penalty_rule_id bigint NOT NULL CONSTRAINT PK_billing_penalty_rule PRIMARY KEY,
    contract_id bigint NOT NULL,
    code nvarchar(80) NOT NULL,
    description nvarchar(300) NOT NULL,
    penalty_type varchar(30) NOT NULL,
    calculation_base varchar(30) NOT NULL,
    percentage decimal(12,6) NULL,
    fixed_value_cents bigint NULL,
    percentage_cap decimal(12,6) NULL,
    is_cumulative bit NOT NULL,
    effective_from date NOT NULL,
    effective_to date NULL,
    is_active bit NOT NULL,
    CONSTRAINT FK_billing_penalty_rule_contract FOREIGN KEY (contract_id) REFERENCES billing.contract(contract_id),
    CONSTRAINT UQ_billing_penalty_rule_code UNIQUE (contract_id, code),
    CONSTRAINT CK_billing_penalty_rule_dates CHECK (effective_to IS NULL OR effective_to >= effective_from)
);

CREATE TABLE billing.required_document (
    required_document_id bigint NOT NULL CONSTRAINT PK_billing_required_document PRIMARY KEY,
    contract_id bigint NOT NULL,
    code nvarchar(80) NOT NULL,
    description nvarchar(300) NOT NULL,
    required_for_payment bit NOT NULL,
    is_active bit NOT NULL,
    CONSTRAINT FK_billing_required_document_contract FOREIGN KEY (contract_id) REFERENCES billing.contract(contract_id),
    CONSTRAINT UQ_billing_required_document_code UNIQUE (contract_id, code)
);

CREATE TABLE billing.billing_period (
    billing_period_id bigint NOT NULL CONSTRAINT PK_billing_period PRIMARY KEY,
    contract_id bigint NOT NULL,
    reference_year smallint NOT NULL,
    reference_month tinyint NOT NULL,
    period_from date NOT NULL,
    period_to date NOT NULL,
    status varchar(20) NOT NULL,
    release_status varchar(20) NOT NULL,
    disallowance_cents bigint NOT NULL CONSTRAINT DF_billing_period_disallowance DEFAULT 0,
    contractual_retention_cents bigint NOT NULL CONSTRAINT DF_billing_period_contractual_retention DEFAULT 0,
    tax_retention_cents bigint NOT NULL CONSTRAINT DF_billing_period_tax_retention DEFAULT 0,
    closed_at datetime2(3) NULL,
    closed_by nvarchar(160) NULL,
    concurrency_token rowversion NOT NULL,
    CONSTRAINT FK_billing_period_contract FOREIGN KEY (contract_id) REFERENCES billing.contract(contract_id),
    CONSTRAINT UQ_billing_period_reference UNIQUE (contract_id, reference_year, reference_month),
    CONSTRAINT CK_billing_period_month CHECK (reference_month BETWEEN 1 AND 12),
    CONSTRAINT CK_billing_period_dates CHECK (period_to >= period_from),
    CONSTRAINT CK_billing_period_values CHECK (disallowance_cents >= 0 AND contractual_retention_cents >= 0 AND tax_retention_cents >= 0),
    CONSTRAINT CK_billing_period_status CHECK (status IN ('RASCUNHO', 'EM_APURACAO', 'CALCULADA', 'BLOQUEADA', 'LIBERADA', 'FECHADA')),
    CONSTRAINT CK_billing_period_release CHECK (release_status IN ('PENDENTE', 'BLOQUEADO', 'LIBERADO'))
);

CREATE TABLE billing.measurement (
    measurement_id bigint NOT NULL CONSTRAINT PK_billing_measurement PRIMARY KEY,
    billing_period_id bigint NOT NULL,
    billable_item_id bigint NOT NULL,
    service_unit_id bigint NULL,
    measured_quantity decimal(19,6) NOT NULL,
    accepted_quantity decimal(19,6) NOT NULL,
    pro_rata_factor decimal(19,8) NOT NULL,
    transition_factor decimal(19,8) NOT NULL,
    CONSTRAINT FK_billing_measurement_period FOREIGN KEY (billing_period_id) REFERENCES billing.billing_period(billing_period_id),
    CONSTRAINT FK_billing_measurement_item FOREIGN KEY (billable_item_id) REFERENCES billing.billable_item(billable_item_id),
    CONSTRAINT FK_billing_measurement_unit FOREIGN KEY (service_unit_id) REFERENCES billing.service_unit(service_unit_id),
    CONSTRAINT UQ_billing_measurement_item UNIQUE (billing_period_id, billable_item_id, service_unit_id),
    CONSTRAINT CK_billing_measurement_values CHECK (measured_quantity >= 0 AND accepted_quantity >= 0 AND pro_rata_factor >= 0 AND transition_factor >= 0)
);

CREATE TABLE billing.billing_event (
    billing_event_id bigint NOT NULL CONSTRAINT PK_billing_event PRIMARY KEY,
    billing_period_id bigint NOT NULL,
    billable_item_id bigint NULL,
    service_unit_id bigint NULL,
    sla_indicator_id bigint NULL,
    penalty_rule_id bigint NULL,
    event_type varchar(30) NOT NULL,
    quantity decimal(19,6) NOT NULL,
    minutes decimal(19,6) NULL,
    hours decimal(19,6) NULL,
    severity nvarchar(40) NULL,
    occurred_at datetime2(3) NOT NULL,
    CONSTRAINT FK_billing_event_period FOREIGN KEY (billing_period_id) REFERENCES billing.billing_period(billing_period_id),
    CONSTRAINT FK_billing_event_item FOREIGN KEY (billable_item_id) REFERENCES billing.billable_item(billable_item_id),
    CONSTRAINT FK_billing_event_unit FOREIGN KEY (service_unit_id) REFERENCES billing.service_unit(service_unit_id),
    CONSTRAINT FK_billing_event_sla FOREIGN KEY (sla_indicator_id) REFERENCES billing.sla_indicator(sla_indicator_id),
    CONSTRAINT FK_billing_event_penalty FOREIGN KEY (penalty_rule_id) REFERENCES billing.penalty_rule(penalty_rule_id),
    CONSTRAINT CK_billing_event_values CHECK (quantity >= 0 AND (minutes IS NULL OR minutes >= 0) AND (hours IS NULL OR hours >= 0))
);

CREATE TABLE billing.sla_assessment (
    sla_assessment_id bigint NOT NULL CONSTRAINT PK_billing_sla_assessment PRIMARY KEY,
    billing_period_id bigint NOT NULL,
    sla_indicator_id bigint NOT NULL,
    billable_item_id bigint NULL,
    service_unit_id bigint NULL,
    assessed_value decimal(19,8) NOT NULL,
    quantity decimal(19,6) NOT NULL,
    calculation_base_cents bigint NULL,
    CONSTRAINT FK_billing_sla_assessment_period FOREIGN KEY (billing_period_id) REFERENCES billing.billing_period(billing_period_id),
    CONSTRAINT FK_billing_sla_assessment_indicator FOREIGN KEY (sla_indicator_id) REFERENCES billing.sla_indicator(sla_indicator_id),
    CONSTRAINT FK_billing_sla_assessment_item FOREIGN KEY (billable_item_id) REFERENCES billing.billable_item(billable_item_id),
    CONSTRAINT FK_billing_sla_assessment_unit FOREIGN KEY (service_unit_id) REFERENCES billing.service_unit(service_unit_id)
);

CREATE TABLE billing.period_document (
    billing_period_id bigint NOT NULL,
    required_document_id bigint NOT NULL,
    is_delivered bit NOT NULL,
    is_validated bit NOT NULL,
    delivered_at datetime2(3) NULL,
    CONSTRAINT PK_billing_period_document PRIMARY KEY (billing_period_id, required_document_id),
    CONSTRAINT FK_billing_period_document_period FOREIGN KEY (billing_period_id) REFERENCES billing.billing_period(billing_period_id),
    CONSTRAINT FK_billing_period_document_required FOREIGN KEY (required_document_id) REFERENCES billing.required_document(required_document_id)
);

CREATE TABLE billing.calculation_result (
    billing_period_id bigint NOT NULL,
    version_no int NOT NULL,
    calculated_at datetime2(3) NOT NULL,
    calculated_by nvarchar(160) NOT NULL,
    gross_value_cents bigint NOT NULL,
    sla_discount_cents bigint NOT NULL,
    disallowance_cents bigint NOT NULL,
    penalty_cents bigint NOT NULL,
    contractual_retention_cents bigint NOT NULL,
    tax_retention_cents bigint NOT NULL,
    calculated_value_cents bigint NOT NULL,
    released_value_cents bigint NOT NULL,
    release_status varchar(20) NOT NULL,
    justification nvarchar(1000) NULL,
    previous_version_no int NULL,
    payload_hash binary(32) NOT NULL,
    CONSTRAINT PK_billing_calculation_result PRIMARY KEY (billing_period_id, version_no),
    CONSTRAINT FK_billing_calculation_result_period FOREIGN KEY (billing_period_id) REFERENCES billing.billing_period(billing_period_id),
    CONSTRAINT FK_billing_calculation_result_previous FOREIGN KEY (billing_period_id, previous_version_no) REFERENCES billing.calculation_result(billing_period_id, version_no),
    CONSTRAINT CK_billing_calculation_result_version CHECK (version_no > 0 AND (previous_version_no IS NULL OR previous_version_no < version_no)),
    CONSTRAINT CK_billing_calculation_result_values CHECK (gross_value_cents >= 0 AND sla_discount_cents >= 0 AND disallowance_cents >= 0 AND penalty_cents >= 0 AND contractual_retention_cents >= 0 AND tax_retention_cents >= 0 AND calculated_value_cents >= 0 AND released_value_cents >= 0)
);

CREATE TABLE billing.calculation_memory (
    billing_period_id bigint NOT NULL,
    version_no int NOT NULL,
    line_no int NOT NULL,
    financial_nature varchar(30) NOT NULL,
    billing_rule_id bigint NULL,
    billing_event_id bigint NULL,
    description nvarchar(300) NOT NULL,
    formula nvarchar(1000) NOT NULL,
    base_value_cents bigint NOT NULL,
    rate decimal(12,6) NULL,
    quantity decimal(19,6) NOT NULL,
    result_value_cents bigint NOT NULL,
    CONSTRAINT PK_billing_calculation_memory PRIMARY KEY (billing_period_id, version_no, line_no),
    CONSTRAINT FK_billing_calculation_memory_result FOREIGN KEY (billing_period_id, version_no) REFERENCES billing.calculation_result(billing_period_id, version_no),
    CONSTRAINT FK_billing_calculation_memory_rule FOREIGN KEY (billing_rule_id) REFERENCES billing.billing_rule(billing_rule_id),
    CONSTRAINT FK_billing_calculation_memory_event FOREIGN KEY (billing_event_id) REFERENCES billing.billing_event(billing_event_id),
    CONSTRAINT CK_billing_calculation_memory_nature CHECK (financial_nature IN ('FATURAMENTO', 'DESCONTO_SLA', 'GLOSA', 'PENALIDADE', 'RETENCAO'))
);

CREATE TABLE billing.audit_event (
    audit_event_id bigint IDENTITY(1,1) NOT NULL CONSTRAINT PK_billing_audit_event PRIMARY KEY,
    contract_id bigint NOT NULL,
    billing_period_id bigint NULL,
    event_type varchar(40) NOT NULL,
    description nvarchar(1000) NOT NULL,
    actor nvarchar(160) NOT NULL,
    occurred_at datetime2(3) NOT NULL CONSTRAINT DF_billing_audit_event_occurred_at DEFAULT SYSUTCDATETIME(),
    result_version_no int NULL,
    correlation_id uniqueidentifier NOT NULL CONSTRAINT DF_billing_audit_event_correlation DEFAULT NEWID(),
    CONSTRAINT FK_billing_audit_event_contract FOREIGN KEY (contract_id) REFERENCES billing.contract(contract_id),
    CONSTRAINT FK_billing_audit_event_period FOREIGN KEY (billing_period_id) REFERENCES billing.billing_period(billing_period_id)
);

CREATE INDEX IX_billing_period_status ON billing.billing_period (contract_id, status, reference_year DESC, reference_month DESC);
CREATE INDEX IX_billing_event_period ON billing.billing_event (billing_period_id, event_type);
CREATE INDEX IX_billing_audit_contract_period ON billing.audit_event (contract_id, billing_period_id, occurred_at DESC);

EXEC(N'
CREATE TRIGGER billing.TR_calculation_result_immutable ON billing.calculation_result
INSTEAD OF UPDATE, DELETE AS
BEGIN
    THROW 51001, ''Versoes de calculo sao imutaveis.'', 1;
END;');

EXEC(N'
CREATE TRIGGER billing.TR_calculation_memory_immutable ON billing.calculation_memory
INSTEAD OF UPDATE, DELETE AS
BEGIN
    THROW 51002, ''Memorias de calculo sao imutaveis.'', 1;
END;');

EXEC(N'
CREATE TRIGGER billing.TR_audit_event_immutable ON billing.audit_event
INSTEAD OF UPDATE, DELETE AS
BEGIN
    THROW 51003, ''Eventos de auditoria sao imutaveis.'', 1;
END;');

INSERT INTO billing.schema_migration (version_no, description)
VALUES (1, N'Create billing motor schema');

COMMIT TRANSACTION;