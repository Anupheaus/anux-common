// import { IMap } from '../extensions';
// import { getFS } from './utils';

// type GetValueArgs = [string, ((v: unknown) => unknown) | unknown, unknown];

// interface IFrom<E extends IMap = IMap, P extends IMap = IMap> {
//   env: {
//     mode: string;
//     <K extends keyof E>(name: K): string;
//     <K extends keyof E, V>(name: K, format: (value: string) => V): V;
//     <K extends keyof E>(name: K, defaultValue: E[K]): E[K];
//     <K extends keyof E, V>(name: K, format: (value: string) => V, defaultValue: V): V;
//   };
//   packageJson: {
//     title: string;
//     version: string;
//     <K extends keyof P>(name: K): P[K];
//     <K extends keyof P, V>(name: K, format: (value: P[K]) => V): V;
//     <K extends keyof P>(name: K, defaultValue: P[K]): P[K];
//     <K extends keyof P, V>(name: K, format: (value: P[K]) => V, defaultValue: V): V;
//   };
// }

// function loadJsonFile(file: string) {
//   const fs = getFS();
//   if (!fs.existsSync(file)) { return undefined; }
//   return JSON.parse(fs.readFileSync(file).toString());
// }

// function loadPackageJson(config: IConfig): IMap {
//   const packageJsonContents = loadJsonFile((config.packageJsonKeys as Function)('package.json'));
//   if (!packageJsonContents) { throw new Error('Unable to find the package.json file for this project.'); }
//   return packageJsonContents;
// }

// function loadAnyEnvironmentVariables(config: IConfig) {
//   const envs = loadJsonFile((config.environmentVariableKeys as Function)('envs.json'));
//   if (!envs) { return; }
//   // tslint:disable-next-line: forin
//   for (const key in envs) { process.env[key] = envs[key]; }
// }

// function getValueUsingName(args: GetValueArgs, getValueUsingNameDelegate: (name: string) => unknown): unknown {
//   const name = args[0];
//   const format = typeof (args[1]) === 'function' ? args[1] : (v: unknown) => v;
//   const defaultValue = args.length > 2 ? args[2] : args[1] != null && typeof (args[1]) !== 'function' ? args[1] : undefined;
//   const value = getValueUsingNameDelegate(name);
//   return value != null ? format(value) : defaultValue;
// }

// function createEnvFunc(): IFrom['env'] {
//   const env = ((...args: GetValueArgs) => getValueUsingName(args, name => process.env[name])) as IFrom['env'];
//   env.mode = (process.env['mode'] || '').toLowerCase() === 'production' ? 'production' : 'development';
//   return env;
// }

// function createPackageJsonFunc(config: IConfig): IFrom['packageJson'] {
//   let packageJsonContents: IMap;
//   const packageJson: IFrom['packageJson'] = ((...args: GetValueArgs) => {
//     packageJsonContents = packageJsonContents || loadPackageJson(config);
//     return getValueUsingName(args, name => packageJsonContents[name]);
//   }) as IFrom['packageJson'];
//   Object.defineProperties(packageJson, {
//     title: {
//       get: () => packageJson('name'),
//       enumerable: true,
//       configurable: true,
//     },
//     version: {
//       get: () => packageJson('version'),
//       enumerable: true,
//       configurable: true,
//     },
//   });
//   return packageJson;
// }

// interface IConfig<E extends IMap = IMap, P extends IMap = IMap> {
//   maxSearchDepthForJSONFiles?: number;
//   environmentVariableKeys: E;
//   packageJsonKeys: P;
// }

// export function createSettings<T extends IMap, E extends IMap, P extends IMap>(config: IConfig<E, P>, delegate: (from: IFrom<E, P>) => T): T {
//   config = {
//     maxSearchDepthForJSONFiles: 15,
//     ...config,
//   };
//   loadAnyEnvironmentVariables(config);
//   return delegate({
//     env: createEnvFunc(),
//     packageJson: createPackageJsonFunc(config),
//   });
// }
