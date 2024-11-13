export const statementRunPromise = (statement, params) =>
  new Promise((resolve, reject) => {
    statement.run(params, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(statement);
      }
    });
  });

export const getFromTablePromise = (db, query, params) =>
  new Promise((resolve, reject) => {
    db.get(query, params, (err, record) => {
      if (err) {
        reject(err);
      } else {
        resolve(record);
      }
    });
  });
