import { Table, TBody, TD, TH, THead, TR } from '../ui/Table';
import { TableContainer } from '../ui/TableContainer';
import { PredictionData } from '../../types';
import {
  getPrediction,
  calcImpliedProbs,
  difference,
} from '@/utils/prediction';

export const Odds = ({ data }: { data: PredictionData }) => {
  const diff = difference(data.homePpg, data.awayPpg);

  const prediction = getPrediction(
    data.odds?.home,
    data.odds?.draw,
    data.odds?.away,
    data.homePpg,
    data.awayPpg,
  );

  const imp = calcImpliedProbs(
    data.odds?.home,
    data.odds?.draw,
    data.odds?.away,
  );
  return (
    <TableContainer containerKey="corners">
      <Table>
        <THead>
          <TR isHeader>
            <TH> </TH>
            <TH align="stard">N°</TH>
            <TH>(12)</TH>
            <TH>(X)</TH>
            <TH>PPG</TH>
            <TH>Diff</TH>
            <TH>%(12)</TH>
            <TH>%(X)</TH>
            <TH>Bet</TH>
            <TH>%</TH>
          </TR>
        </THead>
        <TBody>
          <TR>
            <TD>L</TD>
            <TD>{data.home.id}</TD>
            <TD>{data.odds?.home.toFixed(2)}</TD>
            <TD rowSpan={2}>{data.odds?.draw.toFixed(2)}</TD>
            <TD
              className={`font-bold ${data.homePpg > 1.67 ? 'text-emerald-400' : data.homePpg > 1.17 ? 'text-amber-400' : 'text-orange-500'}`}
            >
              {data.homePpg.toFixed(2)}
            </TD>
            <TD
              rowSpan={2}
              className={`font-bold ${diff > 0.64 ? 'text-emerald-400' : diff > 0.46 ? 'text-amber-400' : 'text-orange-500'}`}
            >
              {diff.toFixed(2)}
            </TD>
            <TD>{(imp.home * 100).toFixed(0)}%</TD>
            <TD rowSpan={2}>{(imp.draw * 100).toFixed(0)}%</TD>
            <TD rowSpan={2} className="text-yellow-500">
              {prediction.label}
            </TD>
            <TD
              rowSpan={2}
              className={`${prediction.confidence > 60 ? 'text-emerald-400' : prediction.confidence > 30 ? 'text-yellow-500' : 'text-orange-500'}`}
            >
              {prediction.confidence}%
            </TD>
          </TR>

          <TR>
            <TD>V</TD>
            <TD>{data.away.id}</TD>
            <TD>{data.odds?.away.toFixed(2)}</TD>
            <TD
              className={`font-bold ${data.awayPpg > 1.67 ? 'text-emerald-400' : data.awayPpg > 1.17 ? 'text-amber-400' : 'text-orange-500'}`}
            >
              {data.awayPpg.toFixed(2)}
            </TD>
            <TD>{(imp.away * 100).toFixed(0)}%</TD>
          </TR>
        </TBody>
      </Table>
    </TableContainer>
  );
};
