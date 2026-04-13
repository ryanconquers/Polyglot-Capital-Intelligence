const db = require('../config/db');
const queries = require('../queries/analyticsQueries');

// Simple function to run queries without parameters
const runSimpleQuery = (queryName) => async (req, res) => {
  try {
    const [rows] = await db.query(queries[queryName]);
    res.json(rows);
  } catch (err) {
    console.error(`Error in ${queryName}:`, err);
    res.status(500).json({ error: err.message });
  }
};

// Function for queries with parameters
const runParameterizedQuery = (queryName, requiredParams = []) => async (req, res) => {
  try {
    let query = queries[queryName];
    const params = [];
    
    // Handle different parameter patterns
    if (queryName === 'totalInvestment') {
      const { venture_id, currency } = req.query;
      let whereClause = '';
      
      if (venture_id || currency) {
        whereClause = 'WHERE ';
        if (venture_id) {
          whereClause += 'i.venture_id = ?';
          params.push(venture_id);
        }
        if (currency) {
          if (venture_id) whereClause += ' AND ';
          whereClause += 'i.currency = ?';
          params.push(currency);
        }
      }
      
      query = `
        SELECT v.venture_name, SUM(i.amount_invested) as total_investment
        FROM investment i 
        JOIN Venture v ON i.venture_id = v.venture_id
        ${whereClause}
        GROUP BY v.venture_name
      `;
    }
    else if (queryName === 'investmentCount') {
      const { venture_id } = req.query;
      let whereClause = '';
      
      if (venture_id) {
        whereClause = 'WHERE i.venture_id = ?';
        params.push(venture_id);
      }
      
      query = `
        SELECT v.venture_name, COUNT(*) as num_investments
        FROM investment i 
        JOIN Venture v ON i.venture_id = v.venture_id
        ${whereClause}
        GROUP BY v.venture_name
      `;
    }
    else if (queryName === 'avgInvestment') {
      const { sector } = req.query;
      let whereClause = '';
      
      if (sector) {
        whereClause = 'WHERE pc.sector = ?';
        params.push(sector);
      }
      
      query = `
        SELECT v.venture_name, AVG(i.amount_invested) as avg_investment
        FROM investment i 
        JOIN Venture v ON i.venture_id = v.venture_id
        JOIN portfolio_company pc ON i.company_id = pc.company_id
        ${whereClause}
        GROUP BY v.venture_name
      `;
    }
    else {
      // For all other queries, use the simple version
      const [rows] = await db.query(queries[queryName]);
      return res.json(rows);
    }
    
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error(`Error in ${queryName}:`, err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  // Venture Analytics
  getTotalInvestment: runParameterizedQuery('totalInvestment'),
  getInvestmentCount: runParameterizedQuery('investmentCount'),
  getAvgInvestment: runParameterizedQuery('avgInvestment'),
  getNAV: runSimpleQuery('nav'),
  getProceeds: runSimpleQuery('proceeds'),
  getNetPosition: runSimpleQuery('netPosition'),
  
  // LP Analytics
  getLPCommitment: runSimpleQuery('lpCommitment'),
  getLPCalled: runSimpleQuery('lpCalled'),
  getLPVenture: runSimpleQuery('lpVenture'),
  getVentureCommitment: runSimpleQuery('ventureCommitment'),
  getLPReturns: runSimpleQuery('lpReturns'),
  
  // Deal Analytics
  getDealStage: runSimpleQuery('dealStage'),
  getDealOutcome: runSimpleQuery('dealOutcome'),
  getDealScore: runSimpleQuery('dealScore'),
  getDealSource: runSimpleQuery('dealSource'),
  getCompanyStage: runSimpleQuery('companyStage'),
  
  // Partner Analytics
  getPartnerDeals: runSimpleQuery('partnerDeals'),
  getPartnerInvestments: runSimpleQuery('partnerInvestments'),
  getPartnerScore: runSimpleQuery('partnerScore'),
  getPartnerTitle: runSimpleQuery('partnerTitle'),
  getPartnerCapital: runSimpleQuery('partnerCapital'),
  
  // Investment Analytics
  getCompanyInvestment: runSimpleQuery('companyInvestment'),
  getOwnership: runSimpleQuery('ownership'),
  getRounds: runSimpleQuery('rounds'),
  getVentureCompany: runSimpleQuery('ventureCompany'),
  getAvgOwnership: runSimpleQuery('avgOwnership'),
  
  // Exit Analytics
  getExitDistribution: runSimpleQuery('exitDistribution'),
  getExitCompany: runSimpleQuery('exitCompany'),
  getTotalExit: runSimpleQuery('totalExit'),
  getExitTimeline: runSimpleQuery('exitTimeline'),
  
  // Valuation Analytics
  getValuationSingle: runSimpleQuery('valuationSingle'),
  getValuationMax: runSimpleQuery('valuationMax'),
  getValuationAvg: runSimpleQuery('valuationAvg'),
  getValuationLag: runSimpleQuery('valuationLag'),
  
  // Market Analytics
  getBenchmark: runSimpleQuery('benchmark'),
  getBenchmarkRange: runSimpleQuery('benchmarkRange'),
  getBenchmarkChange: runSimpleQuery('benchmarkChange'),
  getFxRate: runSimpleQuery('fxRate'),
  getFxAvg: runSimpleQuery('fxAvg'),
  
  // System Analytics
  getAudit: runSimpleQuery('audit')
};