import {
    FilterQuery,
    HydratedDocument,
    Model,
    ProjectionFields,
    QueryOptions,
} from "mongoose";
import { DeepPick, DeepPickPath } from "ts-deep-pick/lib";
import {
    AppPopulateOption,
    SchemaDeepPickPath
} from "./entity";

export class EntityRepository<Entity extends Record<string, any>> {
    private readonly model: Model<Entity>;

    constructor(model: Model<Entity>) {
        this.model = model;
    }

    findOne<
        Projection extends ProjectionFields<Entity>,
        Options extends QueryOptions<Entity> & {
            populate?: AppPopulateOption<Entity>;
        }
    >(
        filter: FilterQuery<Entity>,
        projection: Projection,
        options: Options
    ): Promise<
        Options["lean"] extends boolean
            ? SchemaDeepPickPath<
                  Entity,
                  Projection,
                  Options
              > extends DeepPickPath<Entity>
                ? DeepPick<
                      Entity,
                      SchemaDeepPickPath<Entity, Projection, Options>
                  > | null
                : unknown
            : SchemaDeepPickPath<
                  Entity,
                  Projection,
                  Options
              > extends DeepPickPath<Entity>
            ? HydratedDocument<
                  DeepPick<
                      Entity,
                      SchemaDeepPickPath<Entity, Projection, Options>
                  >
              > | null
            : unknown
    > {
        return this.model.findOne(filter, projection, options);
    }
}