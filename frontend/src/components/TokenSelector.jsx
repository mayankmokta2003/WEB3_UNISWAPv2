// import { TOKENS } from "../config/tokens";

// export default function TokenSelector({ label, selected, onSelect }) {
//   return (
//     <div>
//       <label>{label}</label>
//       <select
//         value={selected?.address || ""}
//         onChange={(e) => {
//           const token = TOKENS.find((t) => t.address === e.target.value);
//           onSelect(token);
//         }}
//       >
//         <option value="">Select token</option>
//         {TOKENS.map((token) => (
//           <option key={token.address} value={token.address}>
//             {token.symbol}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }
