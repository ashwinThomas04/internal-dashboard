const Table = ({ columns, data, className = "" }) => {
  return (
    <div className={`w-100 overflow-auto ${className}`}>
      <table className="qb-table w-100">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className={`text-${col.align || 'start'} px-4 py-3 qb-fs-paragraph-xs qb-fw-bold`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rIdx) => (
            <tr key={rIdx}>
              {columns.map((col, cIdx) => (
                <td key={cIdx} className={`text-${col.align || 'start'} px-4 py-4 qb-border-bottom qb-fs-paragraph-sm qb-fw-regular`}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table;
