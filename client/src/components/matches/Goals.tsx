import { Table, TBody, TD, TH, THead, TR } from '../ui/Table';
import { TableContainer } from '../ui/TableContainer';
import { useColor } from '../../hooks/useColor';
import { PredictionData } from '@/types';

export const Goals = ({ data }: { data: PredictionData }) => {
  return (
    <TableContainer containerKey="goals">
      <Table>
        <THead>
          <TR isHeader>
            <TH> </TH>
            <TH align="stard">N°</TH>
            <TH>Gol</TH>
            <TH>+0.5</TH>
            <TH>+1.5</TH>
            <TH>+2.5</TH>
            <TH>GG</TH>
            <TH>Total</TH>
            <TH>+1.5</TH>
            <TH>+2.5</TH>
            <TH>+3.5</TH>
          </TR>
        </THead>
        <TBody>
          <TR>
            <TD>L</TD>
            <TD align="stard">{data.home.id}</TD>
            <TD>{data.pgfl.toFixed(1)}</TD>
            <TD className={useColor(data.gf_05, 69, 'amber')}>
              {data.gf_05.toFixed(0)}%
            </TD>
            <TD className={useColor(data.gf_15, 55, 'indigo')}>
              {data.gf_15.toFixed(0)}%
            </TD>
            <TD className={useColor(data.gf_25, 36, 'indigo')}>
              {data.gf_25.toFixed(0)}%
            </TD>
            <TD className={useColor(data.btts, 57, 'amber')} rowSpan={2}>
              {data.btts.toFixed(0)}%
            </TD>
            <TD rowSpan={2}>{data.total_goals.toFixed(1)}</TD>
            <TD className={useColor(data.over_1_5, 79, 'indigo')} rowSpan={2}>
              {data.over_1_5.toFixed(0)}%
            </TD>
            <TD className={useColor(data.over_2_5, 43, 'indigo')} rowSpan={2}>
              {data.over_2_5.toFixed(0)}%
            </TD>
            <TD className={useColor(data.over_3_5, 35, 'indigo')} rowSpan={2}>
              {data.over_3_5.toFixed(0)}%
            </TD>
          </TR>
          <TR>
            <TD>V</TD>
            <TD align="stard">{data.away.id}</TD>
            <TD>{data.pgfv.toFixed(1)}</TD>
            <TD className={useColor(data.ga_05, 67, 'amber')}>
              {data.ga_05.toFixed(0)}%
            </TD>
            <TD className={useColor(data.ga_15, 49, 'indigo')}>
              {data.ga_15.toFixed(0)}%
            </TD>
            <TD className={useColor(data.ga_25, 26, 'indigo')}>
              {data.ga_25.toFixed(0)}%
            </TD>
          </TR>
        </TBody>
      </Table>
    </TableContainer>
  );
};
