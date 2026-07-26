import { PredictionData } from '@/types';
import { Table, TBody, TD, TH, THead, TR } from '../ui/Table';
import { TableContainer } from '../ui/TableContainer';

export const OutComes = ({ data }: { data: PredictionData }) => {
  return (
    <TableContainer containerKey="outcomes">
      <Table>
        <THead>
          <TR isHeader>
            <TH> </TH>
            <TH align="stard">N°</TH>
            <TH>Win</TH>
            <TH>Draw</TH>
            <TH>Loss</TH>
            <TH>-</TH>
            <TH>Home</TH>
            <TH>Draw</TH>
            <TH>Away</TH>
          </TR>
        </THead>
        <TBody>
          <TR>
            <TD>L</TD>
            <TD align="stard">{data.home.id}</TD>
            <TD>{data.home.home.goals.wins.toFixed(0)}%</TD>
            <TD>{data.home.home.goals.draws.toFixed(0)}%</TD>
            <TD>{data.home.home.goals.defeats.toFixed(0)}%</TD>
            <TD>-</TD>
            <TD rowSpan={2}>{data.win.toFixed(0)}%</TD>
            <TD rowSpan={2}>{data.draw.toFixed(0)}%</TD>
            <TD rowSpan={2}>{data.loss.toFixed(0)}%</TD>
          </TR>
          <TR>
            <TD>V</TD>
            <TD align="stard">{data.away.id}</TD>
            <TD>{data.away.away.goals.wins.toFixed(0)}%</TD>
            <TD>{data.away.away.goals.draws.toFixed(0)}%</TD>
            <TD>{data.away.away.goals.defeats.toFixed(0)}%</TD>
            <TD>-</TD>
          </TR>
        </TBody>
      </Table>
    </TableContainer>
  );
};
