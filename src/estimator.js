export const convertToDays = (digit, unit) => {
  switch (unit) {
    case 'days':
      return digit;
    case 'weeks':
      return Math.trunc(digit * 7);
    case 'months':
      return Math.trunc(digit * 30);
    default:
      throw new Error('invalid unit passed');
  }
};

export const getFactor = (days) => Math.trunc(days / 3);

export const NumberOfInfectedPeopleForNDays = (
  currentlyInfected,
  digit,
  unit
) => {
  const days = convertToDays(digit, unit);
  return Math.trunc(currentlyInfected * 2 ** getFactor(days));
};

const covid19ImpactEstimator = (data) => {
  const impact = {};
  const severeImpact = {};
  const {
    reportedCases, timeToElapse, periodType, totalHospitalBeds
  } = data;
  const { avgDailyIncomePopulation, avgDailyIncomeInUSD } = data.region;

  // CHALLENGE 1

  // Currently infected
  impact.currentlyInfected = reportedCases * 10;

  severeImpact.currentlyInfected = reportedCases * 50;

  // Infections by requested time
  impact.infectionsByRequestedTime = NumberOfInfectedPeopleForNDays(
    impact.currentlyInfected,
    timeToElapse,
    periodType
  );

  severeImpact.infectionsByRequestedTime = NumberOfInfectedPeopleForNDays(
    severeImpact.currentlyInfected,
    timeToElapse,
    periodType
  );

  // CHALLENGE 2

  // Severe cases by Requested time
  impact.severeCasesByRequestedTime = Math.trunc(
    0.15 * impact.infectionsByRequestedTime
  );

  severeImpact.severeCasesByRequestedTime = Math.trunc(
    0.15 * severeImpact.infectionsByRequestedTime
  );

  // Hospital Beds By Requested Time
  impact.hospitalBedsByRequestedTime = Math.trunc(
    0.35 * totalHospitalBeds - impact.severeCasesByRequestedTime
  );

  severeImpact.hospitalBedsByRequestedTime = Math.trunc(
    0.35 * totalHospitalBeds - severeImpact.severeCasesByRequestedTime
  );

  // CHALLENGE 3

  // ICU care
  impact.casesForICUByRequestedTime = Math.trunc(
    0.05 * impact.infectionsByRequestedTime
  );

  severeImpact.casesForICUByRequestedTime = Math.trunc(
    0.05 * severeImpact.infectionsByRequestedTime
  );

  // Ventilators
  impact.casesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * impact.infectionsByRequestedTime
  );

  severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(
    0.02 * severeImpact.infectionsByRequestedTime
  );

  // Dollars in Flight
  impact.dollarsInFlight = Math.trunc((impact.infectionsByRequestedTime
    * avgDailyIncomePopulation
    * avgDailyIncomeInUSD)
    / convertToDays(timeToElapse, periodType));

  severeImpact.dollarsInFlight = Math.trunc((severeImpact.infectionsByRequestedTime
     * avgDailyIncomePopulation
    * avgDailyIncomeInUSD)
    / convertToDays(timeToElapse, periodType));

  return {
    data, // Input data
    impact, // Best case scenario
    severeImpact // Worst case scenario
  };
};

export default covid19ImpactEstimator;
