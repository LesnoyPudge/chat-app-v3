

// type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;
// type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };
// type Cast<X, Y> = X extends Y ? X : Y
// type FromEntries<T> = T extends [infer Key, any][]
//   ? { [K in Cast<Key, string>]: Extract<ArrayElement<T>, [K, any]>[1]}
//   : { [key in string]: any }

// type FromEntriesWithReadOnly<T> = FromEntries<DeepWriteable<T>>

type Entries<T> = {
    [K in keyof T]: [K, T[K]]
}[keyof T][];

// type qwe = Entries<[['some', 1], ['data', 2]]>

interface ObjectConstructor {
    keys<T>(o: T): Array<keyof T>;
    
    // fromEntries<K extends PropertyKey, T = any>(entries: Iterable<readonly [K, T]>): { [k in K]: T }; 
    
    // fromEntries<A extends Iterable<readonly any[]>>(entries: A): { [V in A]: V };

    // fromEntries<T extends Iterable<readonly any[]>>(entries: T): ReturnType<Entries<T>>;
    // fromEntries(entries: Iterable<readonly any[]>): undefined;

    // fromEntries<T>(entries: T): {
    //     [K in keyof T]: [K, T[K]]
    // }[keyof T][];
    // fromEntries(entries: Iterable<readonly any[]>): undefined;

    // fromEntries(entries: Iterable<readonly any[]>): any;
    // fromEntries<T>(obj: T): FromEntriesWithReadOnly<T>
    
    // /**
    //  * Returns an object created by key-value entries for properties and methods
    //  * @param entries An iterable object that contains key-value entries for properties and methods.
    //  */
    //  fromEntries<T = any>(entries: Iterable<readonly [PropertyKey, T]>): { [k: string]: T };

    //  /**
    //   * Returns an object created by key-value entries for properties and methods
    //   * @param entries An iterable object that contains key-value entries for properties and methods.
    //   */
    //  fromEntries(entries: Iterable<readonly any[]>): any;

}