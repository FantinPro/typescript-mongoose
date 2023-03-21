import { ProjectionFields, QueryOptions } from "mongoose";
import { $Values } from "utility-types";
import { BRAND } from "zod";
import { Blog } from "../schemas/blog/blog.schema";

export type Relation = "relation";

export type EntityRelations<Entity extends Record<string, any>> = {
    [K in keyof Entity as Entity[K] extends BRAND<Relation> ? K : never]: K;
};

export type EntityWithoutRelations<Entity extends Record<string, any>> = {
    [K in keyof Entity as Entity[K] extends BRAND<Relation> ? never : K]: K;
};

export type AppPopulateOption<Entity extends Record<string, any>> =
    | keyof EntityRelations<Entity>
    | (keyof EntityRelations<Entity>)[]
    | RestrictedPopulateOptions<Entity>
    | RestrictedPopulateOptions<Entity>[];

export type RestrictedPopulateOptions<Entity extends Record<string, any>> = {
    path: keyof EntityRelations<Entity>
    populate?: $Values<{
        [K in keyof EntityRelations<Entity>]:  K extends string ? isPropertyArray<K, Entity> extends true ? RestrictedPopulateOptions<Entity[K][0]> : RestrictedPopulateOptions<Entity[K]> : never
    }>
}

export type EntityWithPopulate<
    Entity extends Record<string, any>,
    Options extends QueryOptions<Entity> & {
        populate?: AppPopulateOption<Entity>;
    }
> = Options["populate"] extends AppPopulateOption<Entity>
    ? Options["populate"] extends (keyof EntityRelations<Entity>)[]
        ? keyof Pick<
              Entity,
              keyof EntityWithoutRelations<Entity> | Options["populate"][number]
          >
        : Options["populate"] extends RestrictedPopulateOptions<Entity>[]
        ? 
            PathPropertiesForPopulateOptionsArray<Entity, Options["populate"]>

        : 
            Options["populate"] extends RestrictedPopulateOptions<Entity>

        ? 
            PathProperties<Entity, Options["populate"]>

        : 
            never
    : Exclude<keyof Entity, keyof EntityRelations<Entity>>;

export type SchemaDeepPickPath<
    Entity extends Record<string, any>,
    Projection extends ProjectionFields<Entity>,
    Options extends QueryOptions<Entity> & {
        populate?: AppPopulateOption<Entity>;
    }
> = Extract<keyof Projection, keyof Entity> extends never
    ? EntityWithPopulate<Entity, Options>
    : Extract<keyof Projection, keyof Entity>;

type ExtractValueFromKeyPath<
    Entity extends Record<string, any>,
    T extends { path: keyof EntityRelations<Entity> }[]
> = T extends {
    path: infer K;
}[]
    ? K
    : never;

export type isPropertyArray<
    Key extends string,
    Entity extends Record<string, any>
> = Entity[Key] extends Entity[Key][number][] ? true : false;

type PathProperties<
    Entity extends Record<string, any>,
    Options extends Record<string, any>
> = string &
    keyof {
        [K in keyof Entity as Entity[K] extends BRAND<Relation>
            ? K extends Options["path"]
                ? K extends string
                    ? isPropertyArray<K, Entity> extends true
                        ? Options["populate"] extends RestrictedPopulateOptions<Entity[K][0]>
                            ? `${K}.[].${PathProperties<
                                  Entity[K][0],
                                  Options["populate"]
                              >}`
                            : `${K}.[].${PathProperties<Entity[K][0], Options>}`
                        : Options["populate"] extends RestrictedPopulateOptions<Entity[K]>
                        ? `${K}.${PathProperties<
                              Entity[K],
                              Options["populate"]
                          >}`
                        : `${K}.${PathProperties<Entity[K], Options>}`
                    : never
                : never
            : K extends string
            ? K
            : never]: K;
    };
    

type PathPropertiesForPopulateOptionsArray<
    Entity extends Record<string, any>,
    Options extends RestrictedPopulateOptions<Entity>[]
> = keyof {
    [Opt in Options[number] as PathProperties<Entity, Opt>]: 'whatever';
};

type Test1= PathPropertiesForPopulateOptionsArray<
    Blog,
    [{ path: "contributors", populate: { path: "dog", populate: { path: 'breeder'} } }]
>;
type Test2 = PathProperties<Blog, { path: "contributors", populate: { path: "dog" } }>
type Test3 = PathProperties<Blog['contributors'][0], { path: "dog" }>

