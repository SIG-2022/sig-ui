import React, {useEffect, useState} from "react";
import {
    Card,
    CardContent,
    Typography,
    Box, Grid,
} from "@material-ui/core";
import API from "../../../api/api";
import {useLocalStorage} from "../../../hooks/useLocalStorage";
import GaugeChart from 'react-gauge-chart'
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import logo from './Dotted-line.png';
import space from './space.png';

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

    const getGauge = (value, goal, direction, name) => {
        const num = value > 100 ? 100 : (value < 0 ? 0 : value)
        const percentage = num / 100
        const goal2 = goal / 100
        const lengths = [goal2, 1 - goal2]
        const colors = direction === 'desc' ? ["#c3fd5a", "#fd2c43"] : ["#fd2c43", "#c3fd5a"];
        return (
            <Grid container
                  direction="column"
                  justifyContent="space-between"
                  alignItems="center">
                <Grid item>
                    <GaugeChart id="gauge-chart6"
                                nrOfLevels={2}
                                animate={true}
                                arcsLength={lengths}
                                colors={colors}
                                arcWidth={0.1}
                                percent={percentage}
                                needleBaseColor='#AFAFAFFF'
                                textColor='#AFAFAFFF'
                                formatTextValue={(val) => (val + ' %')}
                    />
                </Grid>
                <Grid item>
                    <Typography
                        sx={{
                            fontSize: "16px",
                            fontWeight: "500",
                        }}
                    >
                    {name + ' - Objetivo: ' + goal + '%'}
                    </Typography>
                </Grid>
            </Grid>)

    }

    const getLinearBars = (value, goal, direction, name) => {
        const maxSize = goal * 2;
        const newVal = value > maxSize ? maxSize : (value < 0 ? 0 : value)
        const goalPercentage = goal / maxSize
        const valuePercentage = Math.round(newVal) / maxSize
        const valueStep = (
            <Step transition="scale">
                {({ accomplished }) => (
                    <Grid container
                          direction="column"
                          justifyContent="center"
                          alignItems="center"
                          spacing={0.5}
                    >
                        <Grid item>
                            <Typography
                                sx={{
                                    fontSize: "12px",
                                    fontWeight: "800",
                                }}
                            >
                                {'\u200a \u200a \u200a \u200a \u200a' + Math.round(newVal)}
                            </Typography>
                        </Grid>
                    </Grid>
                )}
            </Step>
        )
        const stepPosition = [valuePercentage * 100, goalPercentage * 100]
        return {
        comp: (
            <div style={{marginBottom: '40px', marginTop: '60px'}}>
                <ProgressBar
                    percent={valuePercentage * 100}
                    filledBackground="linear-gradient(to right, #fefb72, #f0bb31)"
                    stepPositions={stepPosition}
                >
                    {valueStep}
                    <Step transition="scale">
                        {({ accomplished }) => (
                            <Grid container
                                  direction="column"
                                  justifyContent="center"
                                  alignItems="center"
                                  spacing={0.5}
                            >
                                <Grid item>
                                    <img
                                        style={{ filter: `grayscale(${accomplished ? 0 : 80}%)`}}
                                        height={'10'}
                                        width={'45'}
                                        color={'blue'}
                                        src={space}
                                        alt="space"
                                    />
                                </Grid>
                                <Grid item>
                                    <img
                                        style={{ filter: `grayscale(${accomplished ? 0 : 80}%)`}}
                                        height={'33'}
                                        width={'45'}
                                        color={'blue'}
                                        src={logo}
                                        alt="logo"
                                    />
                                </Grid>
                                <Grid item>
                                    <Typography
                                        sx={{
                                            fontSize: "16px",
                                            fontWeight: "500",
                                        }}
                                    >
                                        {goal + ' dias'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        )}
                    </Step>
                </ProgressBar>
            </div>
        ), name: name + ' - Objetivo: ' + goal + ' dias'};
    }

    //BARRA
    const IDPMIndicator = getLinearBars(indicators?.IDPM || 0, 5, 'desc', 'Tiempo promedio de espera a PM (IDPM)');
    const IDNEIndicator = getLinearBars(indicators?.IDNE || 0, 15, 'desc', 'Tiempo promedio de contratación de nuevos empleados (IDNE)');
    const IDEIndicator = getLinearBars(indicators?.IDE || 0, 7, 'desc', 'Tiempo de espera para conformación de equipo (IDE)');

    //GAUGE
    const APIndicator = getGauge(indicators?.AP || 0, 85, 'asc', 'Porcentaje de aceptación de presupuesto (AP)');
    const APPIIndicator = getGauge(indicators?.APPI || 0, 60, 'asc', 'Porcentaje de aceptación de presupuesto en primera instancia (APPI)');
    const MPPIndicator = getGauge(indicators?.MPP || 0, 55, 'asc', 'Margen neto promedio de proyectos (MPP)');
    const REPMIndicator = getGauge(indicators?.REPM || 0, 7, 'desc', 'Porcentaje de Rechazo a esperar a PM (REPM)');

    const ICNIndicator = getGauge(indicators?.ICN || 0, 25, 'asc', 'Índice de clientes nuevos (ICN)');
    const IRIndicator = getGauge(indicators?.IR || 0, 70, 'asc', 'Índice de recontratación (IR)');

    const monthlyIndicators = props?.monthly ?
        [IDPMIndicator, IDNEIndicator, IDEIndicator, APIndicator, APPIIndicator, MPPIndicator, REPMIndicator] :
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
              <div style={{marginBottom: '20px'}}>
                  {indicator.comp ? indicator.comp : indicator}
                  {indicator.name &&
                      <Grid
                          container
                          direction="column"
                          justifyContent="center"
                          alignItems="center">
                          <Grid item>
                              <Typography
                                  sx={{
                                      fontSize: "16px",
                                      fontWeight: "500",
                                  }}
                              >
                                  {indicator.name}
                              </Typography>
                          </Grid>
                      </Grid>
                  }
              </div>
          ))}
      </CardContent>
    </Card>
  );
};

export default Indicators;
