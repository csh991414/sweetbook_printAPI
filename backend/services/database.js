const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, '../database.json');

// Initial data structure
const initialState = {
  books: [],
  pages: []
};

// Ensure database file exists
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify(initialState, null, 2));
}

/**
 * File-based JSON Database (Mimics SQL helper interface)
 * To avoid native 'sqlite3' installation issues while ensuring persistence.
 */
const dbHelper = {
  async _read() {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  },

  async _write(data) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  },

  async all(sql, params = []) {
    const data = await this._read();
    if (sql.includes('FROM books')) {
      return data.books.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    if (sql.includes('FROM pages')) {
      const bookUid = params[0];
      return data.pages.filter(p => p.bookUid === bookUid);
    }
    return [];
  },

  async run(sql, params = []) {
    const data = await this._read();
    
    if (sql.startsWith('INSERT INTO books')) {
      const [bookUid, title, description] = params;
      const newBook = {
        id: Date.now(),
        bookUid,
        title,
        description,
        createdAt: new Date().toISOString()
      };
      data.books.push(newBook);
      await this._write(data);
      return { id: newBook.id };
    }

    if (sql.startsWith('INSERT INTO pages')) {
      // (Implementation for pages if needed, currently using API for pages)
    }

    if (sql.startsWith('DELETE FROM books')) {
      // (Implementation for delete)
    }

    return { changes: 1 };
  },

  async get(sql, params = []) {
    const data = await this._read();
    if (sql.includes('FROM books')) {
      return data.books.find(b => b.bookUid === params[0]);
    }
    return null;
  }
};

module.exports = dbHelper;
