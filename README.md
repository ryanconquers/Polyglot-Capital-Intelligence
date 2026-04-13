Here's a **complete, professional README** for your PCIS project — ready to copy-paste into your GitHub repository:

---

# 🏦 Polyglot Capital Intelligence System (PCIS)

> A full-stack DBMS for private capital and venture analytics — tracking investments, LP commitments, deal pipelines, exits, and valuations.

---

## 📌 Overview

PCIS is a comprehensive database management system designed for venture capital firms and private equity funds. It provides end-to-end visibility across the entire investment lifecycle, from deal sourcing and LP commitments to valuation tracking and exit analysis.

---

## 🎯 Business Problem Solved

Private capital firms struggle with:
- Tracking investments across multiple ventures and portfolio companies
- Managing LP (Limited Partner) commitments and distributions
- Monitoring deal pipelines and exit opportunities
- Analyzing time-series valuations against market benchmarks

**PCIS solves these with a centralized, normalized database and 40+ analytical queries.**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Database** | MySQL (23 tables, 3NF) |
| **Backend** | Node.js + Express + mysql2 |
| **Frontend** | React + Vite + Axios |
| **Visualization** | Chart.js / Plotly |
| **Authentication** | JWT / Session-based |

---

## 📊 Database Design

### 23 Tables organized into domains:

| Domain | Tables |
|--------|--------|
| **Ventures** | Venture, investment, valuation_mark |
| **Limited Partners** | limited_partner, commitment |
| **Deals** | deal, deal_outcome, portfolio_company |
| **Exits** | exit_event, exit_proceeds |
| **GP Partners** | gp_partner |
| **Market Data** | benchmark_index, fx_rate |
| **Audit** | audit_log |

### Key Features:
- ✅ 3NF Normalization
- ✅ Foreign key constraints
- ✅ Indexes on frequently queried columns
- ✅ Stored procedures
- ✅ Triggers for audit logging
- ✅ Views for performance summaries

---

## 📈 40+ Analytical Queries

| Category | What It Answers |
|----------|-----------------|
| **Venture Analytics** | Total investment, NAV, proceeds, net position |
| **LP Analytics** | Commitments, called amounts, returns, venture exposure |
| **Deal Analytics** | Pipeline by stage, pass reasons, scores by partner |
| **Exit Analytics** | IPO vs acquisition breakdown, proceeds by company |
| **Valuation** | Fair value trends, peak valuations, lag analysis |
| **Benchmark** | Index trends, range, period-over-period change |
| **FX Analysis** | Historical rates, averages |
| **Audit** | Who changed what and when |

---

## 🚀 Getting Started

### Prerequisites

```bash
Node.js >= 18.x
MySQL >= 8.0
npm or yarn
```

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/pcis.git
cd pcis
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd frontend
npm install
```

4. **Set up the database**
```bash
# Create database
mysql -u root -p
CREATE DATABASE pcis_db;

# Import schema
mysql -u root -p pcis_db < database/schema.sql

# Import sample data (optional)
mysql -u root -p pcis_db < database/seed_data.sql
```

5. **Configure environment variables**
```bash
# backend/.env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=pcis_db
PORT=5000
JWT_SECRET=your_secret_key
```

6. **Run the application**
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

7. **Open your browser**
```
http://localhost:5173
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ventures` | Get all ventures |
| GET | `/api/ventures/:id/nav` | Get NAV for a venture |
| GET | `/api/deals/pipeline` | Get deal pipeline |
| GET | `/api/lps/exposure` | Get LP exposure summary |
| GET | `/api/exits/summary` | Get exit summary |
| GET | `/api/trends/valuation` | Get valuation trends |
| POST | `/api/auth/login` | User login |
| POST | `/api/auth/logout` | User logout |

*Full API documentation available in `/api-docs`*

---

## 📁 Project Structure

```
pcis/
├── backend/
│   ├── config/         # Database configuration
│   ├── controllers/    # Business logic
│   ├── routes/         # API endpoints
│   ├── queries/        # SQL query strings
│   └── server.js       # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page views
│   │   ├── services/   # API calls (Axios)
│   │   └── App.jsx
│   └── package.json
└── database/
    ├── schema.sql      # Table definitions
    └── seed_data.sql   # Sample data
```

---

## 👥 User Roles

| Role | Access |
|------|--------|
| **Admin** | Full access — view/edit all data, manage users |
| **Analyst** | View-only + export reports |
| **Viewer** | Dashboard only |

---

## 🔐 Security Features

- ✅ Password hashing (bcrypt)
- ✅ JWT-based authentication
- ✅ Prepared statements (SQL injection protection)
- ✅ Input validation
- ✅ Audit logging for critical tables

---

## 🧠 Sample Queries

```sql
-- Get top 5 ventures by NAV
SELECT v.venture_name, SUM(vm.fair_value) as NAV
FROM valuation_mark vm
JOIN investment i ON vm.investment_id = i.investment_id
JOIN Venture v ON i.venture_id = v.venture_id
GROUP BY v.venture_name
ORDER BY NAV DESC
LIMIT 5;

-- Get LP exposure summary
SELECT lp.lp_name, 
       SUM(c.committed_amount) as total_commitment,
       SUM(c.called_amount) as total_called,
       SUM(c.distributed_amount) as total_distributed
FROM commitment c
JOIN limited_partner lp ON c.lp_id = lp.lp_id
GROUP BY lp.lp_name;
``

## 🧪 Future Enhancements

- [ ] IRR and DPI/TVPI calculations
- [ ] Real-time data sync with external APIs
- [ ] Advanced charting with drill-down
- [ ] PDF/Excel report generation
- [ ] Email alerts for deal milestones
- [ ] Mobile-responsive design

---

## 🙋‍♂️ Author

**Your Name**
- GitHub: ryanconquers

---

## 📝 License

MIT License — free for academic and commercial use.

---

## 🙏 Acknowledgments

- DBMS course instructor:Dr.Asha Rawat
- Open-source contributors (Express, React, MySQL)

---

**Built with ❤️ for private capital intelligence**

---

Want me to add a **table of contents**, **badges** (build passing, license, etc.), or **deployment instructions** (Render/Vercel)?
