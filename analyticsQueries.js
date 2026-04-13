module.exports = {
  // Venture Analytics
  totalInvestment: `
    SELECT v.venture_name, SUM(i.amount_invested) as total_investment
    FROM investment i 
    JOIN Venture v ON i.venture_id = v.venture_id
    GROUP BY v.venture_name
  `,
  
  investmentCount: `
    SELECT v.venture_name, COUNT(*) as num_investments
    FROM investment i 
    JOIN Venture v ON i.venture_id = v.venture_id
    GROUP BY v.venture_name
  `,
  
  avgInvestment: `
    SELECT v.venture_name, AVG(i.amount_invested) as avg_investment
    FROM investment i 
    JOIN Venture v ON i.venture_id = v.venture_id
    GROUP BY v.venture_name
  `,
  
  nav: `
    SELECT v.venture_name, SUM(vm.fair_value) as NAV
    FROM valuation_mark vm
    JOIN investment i ON vm.investment_id = i.investment_id
    JOIN Venture v ON i.venture_id = v.venture_id
    GROUP BY v.venture_name
  `,
  
  proceeds: `
    SELECT v.venture_name, SUM(ep.gross_proceeds) as proceeds
    FROM exit_proceeds ep
    JOIN investment i ON ep.investment_id = i.investment_id
    JOIN Venture v ON i.venture_id = v.venture_id
    GROUP BY v.venture_name
  `,
  
  netPosition: `
    SELECT v.venture_name, SUM(i.amount_invested) - COALESCE(SUM(ep.gross_proceeds), 0) as net_position
    FROM investment i
    LEFT JOIN exit_proceeds ep ON i.investment_id = ep.investment_id
    JOIN Venture v ON i.venture_id = v.venture_id
    GROUP BY v.venture_name
  `,
  
  lpCommitment: `
    SELECT lp.lp_name, SUM(c.committed_amount) as total_commitment
    FROM commitment c 
    JOIN limited_partner lp ON c.lp_id = lp.lp_id
    GROUP BY lp.lp_name
  `,
  
  lpCalled: `
    SELECT lp.lp_name, SUM(c.called_amount) as called
    FROM commitment c 
    JOIN limited_partner lp ON c.lp_id = lp.lp_id
    GROUP BY lp.lp_name
  `,
  
  lpVenture: `
    SELECT lp.lp_name, v.venture_name, c.committed_amount
    FROM commitment c
    JOIN limited_partner lp ON c.lp_id = lp.lp_id
    JOIN Venture v ON c.venture_id = v.venture_id
  `,
  
  ventureCommitment: `
    SELECT v.venture_name, SUM(c.committed_amount) as total_lp_money
    FROM commitment c 
    JOIN Venture v ON c.venture_id = v.venture_id
    GROUP BY v.venture_name
  `,
  
  lpReturns: `
    SELECT lp.lp_name, SUM(c.distributed_amount) as returns
    FROM commitment c 
    JOIN limited_partner lp ON c.lp_id = lp.lp_id
    GROUP BY lp.lp_name
  `,
  
  dealStage: `SELECT current_stage, COUNT(*) as count FROM deal GROUP BY current_stage`,
  dealOutcome: `SELECT d.deal_id, pc.company_name, do.pass_reason FROM deal d JOIN deal_outcome do ON d.deal_id = do.deal_id JOIN portfolio_company pc ON d.company_id = pc.company_id`,
  dealScore: `SELECT current_stage, AVG(deal_score) as avg_score FROM deal GROUP BY current_stage`,
  dealSource: `SELECT source, COUNT(*) as count FROM deal GROUP BY source`,
  companyStage: `SELECT pc.company_name, d.current_stage FROM deal d JOIN portfolio_company pc ON d.company_id = pc.company_id`,
  
  partnerDeals: `SELECT gp.full_name, COUNT(*) as deals FROM deal d JOIN gp_partner gp ON d.lead_partner_id = gp.partner_id GROUP BY gp.full_name`,
  partnerInvestments: `SELECT gp.full_name, COUNT(i.investment_id) as investments FROM investment i JOIN deal d ON i.deal_id = d.deal_id JOIN gp_partner gp ON d.lead_partner_id = gp.partner_id GROUP BY gp.full_name`,
  partnerScore: `SELECT gp.full_name, AVG(d.deal_score) as avg_score FROM deal d JOIN gp_partner gp ON d.lead_partner_id = gp.partner_id GROUP BY gp.full_name`,
  partnerTitle: `SELECT title, COUNT(*) as count FROM gp_partner GROUP BY title`,
  partnerCapital: `SELECT gp.full_name, SUM(i.amount_invested) as total_invested FROM investment i JOIN deal d ON i.deal_id = d.deal_id JOIN gp_partner gp ON d.lead_partner_id = gp.partner_id GROUP BY gp.full_name`,
  
  companyInvestment: `SELECT pc.company_name, SUM(i.amount_invested) as total_invested FROM investment i JOIN portfolio_company pc ON i.company_id = pc.company_id GROUP BY pc.company_name`,
  ownership: `SELECT pc.company_name, i.ownership_pct FROM investment i JOIN portfolio_company pc ON i.company_id = pc.company_id`,
  rounds: `SELECT round_name, COUNT(*) as count FROM investment GROUP BY round_name`,
  ventureCompany: `SELECT v.venture_name, pc.company_name FROM investment i JOIN Venture v ON i.venture_id = v.venture_id JOIN portfolio_company pc ON i.company_id = pc.company_id`,
  avgOwnership: `SELECT AVG(ownership_pct) as avg_ownership FROM investment`,
  
  exitDistribution: `SELECT exit_type, COUNT(*) as count FROM exit_event GROUP BY exit_type`,
  exitCompany: `SELECT pc.company_name, ep.gross_proceeds FROM exit_proceeds ep JOIN exit_event ee ON ep.exit_id = ee.exit_id JOIN portfolio_company pc ON ee.company_id = pc.company_id`,
  totalExit: `SELECT SUM(gross_proceeds) as total_exit FROM exit_proceeds`,
  exitTimeline: `SELECT exit_date, total_proceeds FROM exit_event`,
  
  valuationSingle: `SELECT mark_date, fair_value FROM valuation_mark WHERE investment_id = 1`,
  valuationMax: `SELECT investment_id, MAX(fair_value) as max_value FROM valuation_mark GROUP BY investment_id`,
  valuationAvg: `SELECT mark_date, AVG(fair_value) as avg_value FROM valuation_mark GROUP BY mark_date`,
  valuationLag: `SELECT investment_id, mark_date, LAG(fair_value) OVER (PARTITION BY investment_id ORDER BY mark_date) as prev_value FROM valuation_mark`,
  
  benchmark: `SELECT index_date, index_level FROM benchmark_index ORDER BY index_date`,
  benchmarkRange: `SELECT MAX(index_level) as max_level, MIN(index_level) as min_level FROM benchmark_index`,
  benchmarkChange: `SELECT index_date, index_level - LAG(index_level) OVER (ORDER BY index_date) as change_value FROM benchmark_index`,
  
  fxRate: `SELECT rate_date, rate FROM fx_rate ORDER BY rate_date`,
  fxAvg: `SELECT AVG(rate) as avg_rate FROM fx_rate`,
  
  audit: `SELECT table_name, action, COUNT(*) as count FROM audit_log GROUP BY table_name, action`
};