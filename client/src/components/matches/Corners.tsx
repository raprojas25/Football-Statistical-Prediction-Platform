import { Table, TBody, TD, TH, THead, TR } from '../ui/Table';
import { TableContainer } from '../ui/TableContainer';
import { PredictionData } from '../../types';
import { useColor } from '@/hooks/useColor';

export const Corners = ({ data }: { data: PredictionData }) => {
  return (
    <TableContainer containerKey="corners">
      <Table>
        <THead>
          <TR isHeader>
            <TH> </TH>
            <TH align="stard">N°</TH>
            <TH>+/-</TH>
            <TH>+3.5</TH>
            <TH>+4.5</TH>
            <TH>+5.5</TH>
            <TH>+6.5</TH>
            <TH>T</TH>
            <TH>M</TH>
            <TH>+9.5</TH>
            <TH>+10.5</TH>
            <TH>+11.5</TH>
            <TH>+12.5</TH>
          </TR>
        </THead>
        <TBody>
          <TR>
            <TD>L</TD>
            <TD>{data.home.id}</TD>
            <TD>{data.corners_home.toFixed(1)}</TD>
            <TD className={useColor(data.cf_over_35, 49, 'violet')}>
              {data.cf_over_35.toFixed(0)}%
            </TD>
            <TD>{data.cf_over_45.toFixed(0)}%</TD>
            <TD>{data.cf_over_55.toFixed(0)}%</TD>
            <TD>{data.cf_over_65.toFixed(0)}%</TD>
            <TD rowSpan={2}>{data.total_corners.toFixed(1)}</TD>
            <TD rowSpan={2}>{data.total_corners_match.toFixed(1)}</TD>
            <TD rowSpan={2}>{data.tc_over_95.toFixed(0)}%</TD>
            <TD rowSpan={2}>{data.tc_over_105.toFixed(0)}%</TD>
            <TD rowSpan={2}>{data.tc_over_115.toFixed(0)}%</TD>
            <TD rowSpan={2}>{data.tc_over_125.toFixed(0)}%</TD>
          </TR>

          <TR>
            <TD>V</TD>
            <TD>{data.away.id}</TD>
            <TD>{data.corners_away.toFixed(1)}</TD>
            <TD>{data.ca_over_35.toFixed(0)}%</TD>
            <TD>{data.ca_over_45.toFixed(0)}%</TD>
            <TD>{data.ca_over_55.toFixed(0)}%</TD>
            <TD>{data.ca_over_65.toFixed(0)}%</TD>
          </TR>
        </TBody>
      </Table>
    </TableContainer>
  );
};
