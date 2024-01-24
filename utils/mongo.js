import Survey from '../modals/Survey';
import SurveyResult from '@/modals/SurveyResult';
import { dbConnect, dbDisconnect } from './dbConnect';

dbConnect();

const collectionsTable = {
  Survey: Survey,
  SurveyResult: SurveyResult,
};

const logTime = async (query) => {
  const start = Date.now();
  try {
    return await query;
  } finally {
    const timeTaken = Date.now() - start;
    // console.log(`MONGO: ${query}. Time taken: ${timeTaken}ms`);
  }
};

export const MongoDisconnect = () => {
  return dbDisconnect();
};

const getModel = (collection) => {
  return collectionsTable[collection];
};

export const Mongo = {
  count: async ({ collection, query }) => {
    const model = getModel(collection);
    return await logTime(model.count(query));
  },
  create: async ({ collection, object }) => {
    const model = getModel(collection);
    return await logTime(new model(object).save());
  },

  upsert: async ({ collection, query, updateData }) => {
    updateData.updatedAt = Date.now();
    const model = getModel(collection);
    return await logTime(
      model.findOneAndUpdate(
        query,
        { $set: updateData },
        { new: true, upsert: true }
      )
    );
  },

  

  updateOne: async ({
    collection,
    id,
    updateData,
    returnField,
    verifyUpdatedAt,
  }) => {
    const query = { _id: id };
    if (verifyUpdatedAt) {
      query.updatedAt = verifyUpdatedAt;
    }
    return await Mongo.updateOneWithQuery({
      collection,
      query,
      updateData,
      returnField,
    });
  },

  
 
  findAll: async ({ collection, query, returnField, limit, sort }) => {
    const model = getModel(collection);
    return await logTime(
      model.find(query, returnField)?.limit(limit)?.sort(sort)
    );
  },

  findOne: async ({ collection, query, returnField }) => {
    const model = getModel(collection);
    return await logTime(model.findOne(query, returnField));
  },



  deleteOne: async ({ collection, id }) => {
    const model = getModel(collection);
    return await logTime(model.deleteOne({ _id: id }));
  },

  deleteMany: async ({ collection, query }) => {
    const model = getModel(collection);
    return await logTime(model.deleteMany(query));
  },


};
