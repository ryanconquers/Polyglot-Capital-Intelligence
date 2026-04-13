const express = require('express')
const router = express.Router()
const c = require('../controllers/analyticsController')

router.get('/total-investment', c.getTotalInvestment)
router.get('/investment-count', c.getInvestmentCount)
router.get('/avg-investment', c.getAvgInvestment)
router.get('/nav', c.getNAV)
router.get('/proceeds', c.getProceeds)
router.get('/net-position', c.getNetPosition)

router.get('/lp-commitment', c.getLPCommitment)
router.get('/lp-called', c.getLPCalled)
router.get('/lp-venture', c.getLPVenture)
router.get('/venture-commitment', c.getVentureCommitment)
router.get('/lp-returns', c.getLPReturns)

router.get('/deal-stage', c.getDealStage)
router.get('/deal-outcome', c.getDealOutcome)
router.get('/deal-score', c.getDealScore)
router.get('/deal-source', c.getDealSource)
router.get('/company-stage', c.getCompanyStage)

router.get('/partner-deals', c.getPartnerDeals)
router.get('/partner-investments', c.getPartnerInvestments)
router.get('/partner-score', c.getPartnerScore)
router.get('/partner-title', c.getPartnerTitle)
router.get('/partner-capital', c.getPartnerCapital)

router.get('/company-investment', c.getCompanyInvestment)
router.get('/ownership', c.getOwnership)
router.get('/rounds', c.getRounds)
router.get('/venture-company', c.getVentureCompany)
router.get('/avg-ownership', c.getAvgOwnership)

router.get('/exit-distribution', c.getExitDistribution)
router.get('/exit-company', c.getExitCompany)
router.get('/total-exit', c.getTotalExit)
router.get('/exit-timeline', c.getExitTimeline)

router.get('/valuation-single', c.getValuationSingle)
router.get('/valuation-max', c.getValuationMax)
router.get('/valuation-avg', c.getValuationAvg)
router.get('/valuation-lag', c.getValuationLag)

router.get('/benchmark', c.getBenchmark)
router.get('/benchmark-range', c.getBenchmarkRange)
router.get('/benchmark-change', c.getBenchmarkChange)

router.get('/fx-rate', c.getFxRate)
router.get('/fx-avg', c.getFxAvg)

router.get('/audit', c.getAudit)

module.exports = router