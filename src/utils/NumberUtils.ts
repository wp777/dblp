export class NumberUtils {
    
    static canConvertStringToNumber(str: string): boolean {
        return !isNaN(str as unknown as number) && !isNaN(parseFloat(str));
    }
    
    static convertStringToNumber(str: string): number | null {
        const parsedValue = parseFloat(str);
        return isNaN(parsedValue) ? null : parsedValue;
    }
    
    static createNumbersRange(first: number, last: number): number[] {
        return Array.from(new Array(last - first + 1), (_, i) => i + first);
    }
    
}
