export const runQueryPromise = (statement, params) =>
  new Promise((resolve, reject) => {
    statement.run(params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(statement);
      }
    });
  });

export const getQueryPromise = (db, query, params) =>
  new Promise((resolve, reject) => {
    db.get(query, params, (err, record) => {
      if (err) {
        reject(err);
      } else {
        resolve(record);
      }
    });
  });
