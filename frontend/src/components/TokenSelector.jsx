export default function TokenSelector({ value, onChange }) {
    return (
      <select
        className="border p-2 w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select Token</option>
        {TOKENS.map((t) => (
          <option key={t.address} value={t.address}>
            {t.symbol}
          </option>
        ))}
      </select>
    );
  }
  