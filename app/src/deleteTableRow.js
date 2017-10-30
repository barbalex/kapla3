export default function (db, table, id) {
  return new Promise((resolve, reject) => {
    const sql = `
      DELETE FROM
        ${table}
      WHERE
        id = ${id}`

    db.query(sql, error => {
      if (error) reject(error)
      resolve(true)
    })
  })
}
