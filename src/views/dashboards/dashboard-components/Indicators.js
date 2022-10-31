import React, {useEffect, useState} from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
} from "@material-ui/core";
import ProgressBar from 'react-bootstrap/ProgressBar';
import API from "../../../api/api";
import {useLocalStorage} from "../../../hooks/useLocalStorage";

const Indicators = (props) => {
    const [indicators, setIndicators] = useState(undefined);
    const [jwt] = useLocalStorage("jwt", null);

    useEffect(() => {
        async function getIndicators() {
            const headers = {
                Authorization: 'Bearer ' + jwt
            };
            const response = await API.get(
                `/project/indicators`,
                {headers}
            );
            setIndicators(response.data);
        }

        if (!indicators) {
            getIndicators();
        }
    }, [indicators, jwt])

    const getIndicatorValues = (value, goal, direction='asc', name, unit) => {
        if (direction === 'asc') {
            return {
                value: value * 100,
                real_value: value,
                goal: value <= goal ? (goal - value) * 100 : 0,
                real_goal: goal,
                value_color: value <= goal ? 'warning' : 'success',
                goal_color: 'success',
                name: name,
                unit: unit,
                direction: direction,
                max: value > goal ? value : goal
            }
        }
        return {
            value: value >= goal ? (value - goal) * 100 : 0,
            real_value: value,
            goal: goal * 100,
            real_goal: goal,
            value_color: value >= goal ? 'warning' : 'success',
            goal_color: 'success',
            name: name,
            unit: unit,
            direction: direction,
            max: value > goal ? value : goal
        }
    }

    const IDPMIndicator = getIndicatorValues(indicators?.IDPM, 5, 'desc', 'Tiempo promedio de espera a PM (IDPM)', 'dias');
    const APIndicator = getIndicatorValues(indicators?.AP, 85, 'asc', 'Porcentaje de aceptación de presupuesto (AP)', '%');
    const APPIIndicator = getIndicatorValues(indicators?.APPI, 85, 'asc', 'Porcentaje de aceptación de presupuesto en primera instancia (APPI)', '%');
    const MPPIndicator = getIndicatorValues(indicators?.MPP, 55, 'asc', 'Margen neto promedio de proyectos (MPP)', '%');
    const IDNEIndicator = getIndicatorValues(indicators?.IDNE, 15, 'desc', 'Tiempo promedio de contratación de nuevos empleados (IDNE)', 'dias');
    const REPMIndicator = getIndicatorValues(indicators?.REPM, 7, 'desc', 'Porcentaje de Rechazo a esperar a PM (REPM)', '%');
    const IDEIndicator = getIndicatorValues(indicators?.IDE, 7, 'desc', 'Tiempo de espera para conformación de equipo. (IDE)', 'dias');

    const ICNIndicator = getIndicatorValues(indicators?.ICN, 25, 'asc', 'Índice de clientes nuevos (ICN)', '%');
    const IRIndicator = getIndicatorValues(indicators?.IR, 70, 'asc', 'Índice de recontratación (IR)', '%');

    const monthlyIndicators = props?.monthly ?
        [IDPMIndicator, APIndicator, APPIIndicator, MPPIndicator, IDNEIndicator, REPMIndicator, IDEIndicator] :
        [ICNIndicator, IRIndicator];

    return (
    <Card
      variant="outlined"
      sx={{
        pb: 0,
      }}
    >
      <CardContent
        sx={{
          pb: "0 !important",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            mb: 3,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: "500",
                fontSize: "h3.fontSize",
                marginBottom: "0",
              }}
              gutterBottom
            >
                {props?.tableName}
            </Typography>
            <Typography
              color="textSecondary"
              variant="body1"
              sx={{
                fontWeight: "400",
                fontSize: "13px",
              }}
            >
                {props?.tableDescription}
            </Typography>
          </Box>
        </Box>
          {monthlyIndicators.map((indicator) => (
              <Box sx={{mb: 5}}>
                  <Typography
                      sx={{
                          fontWeight: "300",
                          fontSize: "18px",
                          marginBottom: "2",
                      }}
                      gutterBottom
                  >
                      {indicator.name}
                  </Typography>
                  <ProgressBar max={indicator.real_value > indicator.real_goal ? indicator.real_value : indicator.real_goal} >
                      {indicator.direction === 'desc' ?
                          <ProgressBar stripped variant={indicator.goal_color} now={indicator.goal} label={'Meta: ' + indicator.real_goal + indicator.unit}/> :
                          <ProgressBar striped variant={indicator.value_color} now={indicator.value} label={Math.floor(indicator.real_value) + indicator.unit} />
                          }
                      {indicator.direction === 'desc' ?
                          <ProgressBar striped variant={indicator.value_color} now={indicator.value} label={Math.floor(indicator.real_value) + indicator.unit} /> :
                          <ProgressBar stripped variant={indicator.goal_color} now={indicator.goal} label={'Meta: ' + indicator.real_goal + indicator.unit}/>
                      }
                  </ProgressBar>
              </Box>
          ))}
      </CardContent>
    </Card>
  );
};

export default Indicators;
