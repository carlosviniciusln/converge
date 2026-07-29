"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tasks_1 = require("@angular-devkit/schematics/tasks");
const package_config_1 = require("./package-config");
const fallbackMaterialVersionRange = `~0.0.0-PLACEHOLDER`;
function default_1(options) {
    return (host, context) => {
        const libraryVersionRange = (0, package_config_1.getPackageVersionFromPackageJson)(host, 'sidsc-components');
        if (libraryVersionRange === null)
            (0, package_config_1.addPackageToPackageJson)(host, 'sidsc-components', fallbackMaterialVersionRange);
        const installTaskId = context.addTask(new tasks_1.NodePackageInstallTask());
        context.addTask(new tasks_1.RunSchematicTask('ng-add-setup-project', options), [installTaskId]);
    };
}
exports.default = default_1;
//# sourceMappingURL=index.js.map