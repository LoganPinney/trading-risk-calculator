import { LineChart, Line, CartesianGrid, XAxis, YAxis, ReferenceLine, Scatter } from 'recharts';

const breakevenData = Array.from({ length: 26 }, (_, i) => {
  const rr = 0.5 + i * 0.1; // profit/loss ratio 0.5 → 3
  return { rr, winRate: 100 / (1 + rr) };
});

export default function RiskRewardChart({ riskAmount, potentialProfit }) {
  const ratio = riskAmount > 0 ? potentialProfit / riskAmount : 0;
  const point = { rr: ratio, winRate: 100 / (1 + ratio) };

  return (
    <LineChart width={300} height={200} data={breakevenData}>
      <CartesianGrid stroke="#ccc" strokeDasharray="3 3" />
      <XAxis type="number" dataKey="rr" domain={[0.5, 3]} />
      <YAxis type="number" domain={[0, 100]} />
      <ReferenceLine
        segment={[
          { rr: 0.5, winRate: 100 / (1 + 0.5) },
          { rr: 3, winRate: 100 / (1 + 3) }
        ]}
        stroke="gray"
      />
      <Scatter data={[point]} fill={ratio >= 0 ? 'red' : 'black'} />
    </LineChart>
  );
}