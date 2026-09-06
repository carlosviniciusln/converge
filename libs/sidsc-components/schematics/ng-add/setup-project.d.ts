import { Rule } from '@angular-devkit/schematics';
import { Schema } from './schema';
export declare const defaultTargetBuilders: {
    build: string;
};
export default function (options: Schema): Rule;
export declare function addThemeToAppStyles(options: Schema): Rule;
