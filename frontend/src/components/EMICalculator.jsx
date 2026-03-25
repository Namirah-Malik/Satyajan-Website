import React, { useState, useEffect } from 'react';
import { Calculator, TrendingUp } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';

const EMICalculator = () => {
  const [systemCost, setSystemCost] = useState(250000);
  const [downPayment, setDownPayment] = useState(50000);
  const [interestRate, setInterestRate] = useState(10.5);
  const [loanTenure, setLoanTenure] = useState(5);
  const [tenureType, setTenureType] = useState('years'); // 'years' or 'months'
  const [emi, setEmi] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);

  // Calculate Loan Amount
  useEffect(() => {
    const calculatedLoanAmount = systemCost - downPayment;
    setLoanAmount(calculatedLoanAmount > 0 ? calculatedLoanAmount : 0);
  }, [systemCost, downPayment]);

  // Calculate EMI
  useEffect(() => {
    if (loanAmount > 0 && interestRate > 0 && loanTenure > 0) {
      const principal = loanAmount;
      const monthlyRate = interestRate / 12 / 100;
      const tenureInMonths = tenureType === 'years' ? loanTenure * 12 : loanTenure;

      if (monthlyRate === 0) {
        setEmi(principal / tenureInMonths);
      } else {
        const emiValue =
          (principal * monthlyRate * Math.pow(1 + monthlyRate, tenureInMonths)) /
          (Math.pow(1 + monthlyRate, tenureInMonths) - 1);
        setEmi(emiValue);
      }
    } else {
      setEmi(0);
    }
  }, [loanAmount, interestRate, loanTenure, tenureType]);

  const handleReset = () => {
    setSystemCost(250000);
    setDownPayment(50000);
    setInterestRate(10.5);
    setLoanTenure(5);
    setTenureType('years');
  };

  const totalPayment = emi * (tenureType === 'years' ? loanTenure * 12 : loanTenure);
  const totalInterest = totalPayment - loanAmount;

  return (
    <Card className="w-full shadow-xl border-2 border-blue-100">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Solar EMI Calculator</h3>
            <p className="text-sm text-gray-600">Calculate your monthly payments</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* System Cost */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">System Cost</label>
              <span className="text-lg font-bold text-blue-600">₹{systemCost.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="50000"
              max="1000000"
              step="10000"
              value={systemCost}
              onChange={(e) => setSystemCost(Number(e.target.value))}
              className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <Input
              type="number"
              value={systemCost}
              onChange={(e) => setSystemCost(Number(e.target.value))}
              className="mt-2"
              min="0"
            />
          </div>

          {/* Down Payment */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Down Payment</label>
              <span className="text-lg font-bold text-green-600">₹{downPayment.toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="0"
              max={systemCost}
              step="5000"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="w-full h-2 bg-green-100 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <Input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="mt-2"
              min="0"
              max={systemCost}
            />
          </div>

          {/* Loan Amount (Auto-calculated, Read-only) */}
          <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">Loan Amount</span>
              <span className="text-xl font-bold text-blue-700">₹{loanAmount.toLocaleString()}</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Auto-calculated: System Cost - Down Payment</p>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Interest Rate (%)</label>
              <span className="text-lg font-bold text-orange-600">{interestRate}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="20"
              step="0.5"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2 bg-orange-100 rounded-lg appearance-none cursor-pointer accent-orange-600"
            />
            <Input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="mt-2"
              min="0"
              step="0.1"
            />
          </div>

          {/* Loan Tenure */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Loan Tenure</label>
              <span className="text-lg font-bold text-purple-600">
                {loanTenure} {tenureType}
              </span>
            </div>
            <input
              type="range"
              min={tenureType === 'years' ? 1 : 12}
              max={tenureType === 'years' ? 20 : 240}
              step="1"
              value={loanTenure}
              onChange={(e) => setLoanTenure(Number(e.target.value))}
              className="w-full h-2 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex gap-2 mt-2">
              <Input
                type="number"
                value={loanTenure}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                className="flex-1"
                min="1"
              />
              <select
                value={tenureType}
                onChange={(e) => {
                  setTenureType(e.target.value);
                  if (e.target.value === 'years' && loanTenure > 20) {
                    setLoanTenure(20);
                  } else if (e.target.value === 'months' && loanTenure > 240) {
                    setLoanTenure(240);
                  }
                }}
                className="px-4 py-2 border border-gray-300 rounded-md font-medium"
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>

          {/* Reset Button */}
          <Button
            variant="outline"
            onClick={handleReset}
            className="w-full border-2"
          >
            Reset Calculator
          </Button>
        </div>

        {/* EMI Result */}
        {loanAmount > 0 && (
          <div className="mt-6 space-y-3">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-100 mb-1">Monthly EMI</p>
                  <p className="text-4xl font-bold">₹{Math.round(emi).toLocaleString()}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-blue-200" />
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Total Payment</p>
                <p className="text-lg font-bold text-gray-900">₹{Math.round(totalPayment).toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-xs text-gray-600 mb-1">Total Interest</p>
                <p className="text-lg font-bold text-gray-900">₹{Math.round(totalInterest).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EMICalculator;
