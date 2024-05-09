/// <reference types="../shared/sharedDeclaration.d.ts" />

declare const If: React.FC<React.PropsWithChildren<{ condition: boolean }>>;

declare namespace React {
    function createContext<T>(): Context<T>;
}