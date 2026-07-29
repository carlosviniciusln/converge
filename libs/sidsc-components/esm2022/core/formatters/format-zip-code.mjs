export function formatZipCode(value) {
    if (value) {
        value = value.replace(/\D/g, '');
        if (value.length > 8)
            value = value.substring(0, 8);
        switch (value.length) {
            case 3:
                value = value.replace(/(\d{2})(\d+)/, '$1.$2');
                break;
            case 4:
                value = value.replace(/(\d{2})(\d+)/, '$1.$2');
                break;
            case 5:
                value = value.replace(/(\d{2})(\d+)/, '$1.$2');
                break;
            case 6:
                value = value.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2-$3');
                break;
            case 7:
                value = value.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2-$3');
                break;
            case 8:
                value = value.replace(/(\d{2})(\d{3})(\d+)/, '$1.$2-$3');
                break;
            default:
                return value;
        }
    }
    return value;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0LXppcC1jb2RlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvc2lkc2MtY29tcG9uZW50cy9jb3JlL2Zvcm1hdHRlcnMvZm9ybWF0LXppcC1jb2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sVUFBVSxhQUFhLENBQUMsS0FBYTtJQUN6QyxJQUFJLEtBQUssRUFBRTtRQUNULEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNqQyxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQztZQUFFLEtBQUssR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUVwRCxRQUFRLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDcEIsS0FBSyxDQUFDO2dCQUNKLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDL0MsTUFBTTtZQUNSLEtBQUssQ0FBQztnQkFDSixLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQy9DLE1BQU07WUFDUixLQUFLLENBQUM7Z0JBQ0osS0FBSyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUMvQyxNQUFNO1lBQ1IsS0FBSyxDQUFDO2dCQUNKLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUN6RCxNQUFNO1lBQ1IsS0FBSyxDQUFDO2dCQUNKLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUN6RCxNQUFNO1lBQ1IsS0FBSyxDQUFDO2dCQUNKLEtBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLHFCQUFxQixFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUN6RCxNQUFNO1lBQ1I7Z0JBQ0UsT0FBTyxLQUFLLENBQUM7U0FDaEI7S0FDRjtJQUVELE9BQU8sS0FBSyxDQUFDO0FBQ2YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBmb3JtYXRaaXBDb2RlKHZhbHVlOiBzdHJpbmcpOiBzdHJpbmcge1xuICBpZiAodmFsdWUpIHtcbiAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL1xcRC9nLCAnJyk7XG4gICAgaWYgKHZhbHVlLmxlbmd0aCA+IDgpIHZhbHVlID0gdmFsdWUuc3Vic3RyaW5nKDAsIDgpO1xuXG4gICAgc3dpdGNoICh2YWx1ZS5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC8oXFxkezJ9KShcXGQrKS8sICckMS4kMicpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNDpcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC8oXFxkezJ9KShcXGQrKS8sICckMS4kMicpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNTpcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC8oXFxkezJ9KShcXGQrKS8sICckMS4kMicpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgNjpcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC8oXFxkezJ9KShcXGR7M30pKFxcZCspLywgJyQxLiQyLSQzJyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA3OlxuICAgICAgICB2YWx1ZSA9IHZhbHVlLnJlcGxhY2UoLyhcXGR7Mn0pKFxcZHszfSkoXFxkKykvLCAnJDEuJDItJDMnKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDg6XG4gICAgICAgIHZhbHVlID0gdmFsdWUucmVwbGFjZSgvKFxcZHsyfSkoXFxkezN9KShcXGQrKS8sICckMS4kMi0kMycpO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdmFsdWU7XG59XG4iXX0=