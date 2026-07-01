import { Table, TBody, TD, TH, THead, TR } from '../ui/Table';
import { TableContainer } from '../ui/TableContainer';
import { PredictionData } from '../../types';
import { useColor } from '../../hooks/useColor';

export const Rates = ({ data }: { data: PredictionData }) => {
  const first_home: number = Number(data.first_home.toFixed(0));
  const first_away: number = Number(data.first_away.toFixed(0));
  const bt_home: number = Number(data.bt_home.toFixed(0));
  const bt_away: number = Number(data.bt_away.toFixed(0));

  return (
    <TableContainer containerKey="scoring">
      <Table>
        <THead>
          <TR isHeader>
            <TH> </TH>
            <TH align="stard">N°</TH>
            <TH>1° Gol</TH>
            <TH>H-T</TH>
            <TH>S-T</TH>
            <TH>F-T</TH>
            <TH>Anotará</TH>
            <TH>GG</TH>
            <TH>+2.5</TH>
          </TR>
        </THead>
        <TBody>
          <TR>
            <TD>L</TD>
            <TD align="stard">{data.home.id}</TD>
            <TD className={useColor(first_home - first_away, 24, 'emerald')}>
              {first_home}%
            </TD>
            <TD className={useColor(data.ht_home, 49, 'blue')}>
              {data.ht_home.toFixed(0)}%
            </TD>
            <TD className={useColor(data.st_home, 49, 'blue')}>
              {data.st_home.toFixed(0)}%
            </TD>
            <TD className={useColor(bt_home - bt_away, 14.4, 'blue')}>
              {bt_home}%
            </TD>
            <TD className={useColor(data.scoring_home, 69, 'amber')}>
              {data.scoring_home.toFixed(0)}%
            </TD>
            <TD rowSpan={2} className={useColor(data.btts, 57, 'emerald')}>
              {data.btts.toFixed(0)}%
            </TD>
            <TD rowSpan={2} className={useColor(data.over_2_5, 43, 'emerald')}>
              {data.over_2_5.toFixed(0)}%
            </TD>
          </TR>
          <TR>
            <TD>V</TD>
            <TD align="stard">{data.away.id}</TD>
            <TD className={useColor(first_away - first_home, 24, 'emerald')}>
              {first_away}%
            </TD>
            <TD className={useColor(data.ht_away, 49, 'blue')}>
              {data.ht_away.toFixed(0)}%
            </TD>
            <TD className={useColor(data.st_away, 49, 'blue')}>
              {data.st_away.toFixed(0)}%
            </TD>
            <TD className={useColor(bt_away - bt_home, 14.4, 'blue')}>
              {bt_away}%
            </TD>
            <TD className={useColor(data.scoring_away, 69, 'amber')}>
              {data.scoring_away.toFixed(0)}%
            </TD>
          </TR>
        </TBody>
      </Table>
    </TableContainer>
  );
};
