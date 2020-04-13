import covid19ImpactEstimator, {
  getFactor,
  NumberOfInfectedPeopleForNDays,
  convertToDays
} from './estimator';

describe('covid19ImpactEstimator', () => {
  it('should return an object with data, impact and severeImpact as its properties', () => {
    const data = {
      region: {
        name: 'Africa',
        avgAge: 19.7,
        avgDailyIncomeInUSD: 5,
        avgDailyIncomePopulation: 0.71
      },
      periodType: 'days',
      timeToElapse: 58,
      reportedCases: 674,
      population: 66622705,
      totalHospitalBeds: 1380614
    };

    const result = covid19ImpactEstimator(data);
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('impact');
    expect(result).toHaveProperty('severeImpact');
  });
});

describe('getFactor', () => {
  it('should return the factor for a given number of days ', () => {
    expect(getFactor(1)).toEqual(0);
    expect(getFactor(30)).toEqual(10);
    expect(getFactor(53)).toEqual(17);
  });
});


describe('infectedPeopleForNDays', () => {
  it('should double the number of infected people every 3 days', () => {
    expect(NumberOfInfectedPeopleForNDays(1, 30, 'days')).toEqual(1024);
  });
});

describe('convertToDays', () => {
  it('should convert the  input to days depending on the unit given', () => {
    expect(convertToDays(3, 'weeks')).toEqual(21);
    expect(convertToDays(2, 'months')).toEqual(62);
    expect(convertToDays(2, 'days')).toEqual(2);
  });
});
