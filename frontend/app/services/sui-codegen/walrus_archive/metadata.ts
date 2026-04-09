/**************************************************************
 * THIS FILE IS GENERATED AND SHOULD NOT BE MANUALLY MODIFIED *
 **************************************************************/
import { type Transaction } from '@mysten/sui/transactions';
import { normalizeMoveArguments, type RawTransactionArgument } from '../utils/index.js';
export interface NewMetadataArguments {
    title: RawTransactionArgument<string>;
    description: RawTransactionArgument<string>;
    category: RawTransactionArgument<string>;
}
export interface NewMetadataOptions {
    package?: string;
    arguments: NewMetadataArguments | [
        title: RawTransactionArgument<string>,
        description: RawTransactionArgument<string>,
        category: RawTransactionArgument<string>
    ];
}
export function newMetadata(options: NewMetadataOptions) {
    const packageAddress = options.package ?? '@local-pkg/walarchive';
    const argumentsTypes = [
        '0x1::string::String',
        '0x1::string::String',
        '0x1::string::String',
        '0x2::clock::Clock'
    ] satisfies (string | null)[];
    const parameterNames = ["title", "description", "category"];
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'metadata',
        function: 'new_metadata',
        arguments: normalizeMoveArguments(options.arguments, argumentsTypes, parameterNames),
    });
}
export interface GetTitleLimitOptions {
    package?: string;
    arguments?: [
    ];
}
export function getTitleLimit(options: GetTitleLimitOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/walarchive';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'metadata',
        function: 'get_title_limit',
    });
}
export interface GetDescriptionLimitOptions {
    package?: string;
    arguments?: [
    ];
}
export function getDescriptionLimit(options: GetDescriptionLimitOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/walarchive';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'metadata',
        function: 'get_description_limit',
    });
}
export interface GetCategoryLimitOptions {
    package?: string;
    arguments?: [
    ];
}
export function getCategoryLimit(options: GetCategoryLimitOptions = {}) {
    const packageAddress = options.package ?? '@local-pkg/walarchive';
    return (tx: Transaction) => tx.moveCall({
        package: packageAddress,
        module: 'metadata',
        function: 'get_category_limit',
    });
}