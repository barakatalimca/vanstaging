import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Check from '@material-ui/icons/Check';
import StepConnector from '@material-ui/core/StepConnector';
const QontoConnector = withStyles({
    alternativeLabel: {
        top: 10,
        left: 'calc(-78% + 1px)',
        right: 'calc(85% + 13px)',
    },
    active: {
        '& $line': {
            borderColor: 'green',
        },
    },
    completed: {
        '& $line': {
            borderColor: 'green',
        },
    },
    line: {
        borderColor: '#eaeaf0',
        borderTopWidth: '5px',
        borderRadius: '5px',
    },
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
    root: {
        color: '#000',
        display: 'flex',
        height: 22,
        alignItems: 'center',
        '& *': {
            alignItems: 'end',
            textAlign: 'left'
        }
    },
    active: {
        color: 'green',
    },
    circle: {
        width: '10px',
        height: '10px',
        position: 'relative',
        top: '1px',
        borderRadius: '50%',
        backgroundColor: 'currentColor',
    },
    completed: {
        color: 'green',
        zIndex: 1,
        fontSize: 18,
    },
});

function QontoStepIcon(props) {
    const classes = useQontoStepIconStyles();
    const { active, completed } = props;
    return (
        <div
            className={clsx(classes.root, {
                [classes.active]: active,
            })}
        >
            {completed ? <Check className={classes.completed} /> : <div className={classes.circle} />}
        </div>
    );
}

QontoStepIcon.propTypes = {
    active: PropTypes.bool,
    completed: PropTypes.bool,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    button: {
        marginRight: theme.spacing(1),
    },
    instructions: {
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
}));

function getSteps() {
    return ['Ordered', 'Packed', 'Shipped', 'Delivered'];
}

function getStepContent(step) {
    switch (step) {
        case 0:
            return 'Thu, 25th Jun';
        case 1:
            return 'Fri, 26th Jun';
        case 2:
            return '';
        case 3:
            return '';
        default:
            return 'Unknown step';
    }
}

export default function OrderTracker() {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(1);
    const steps = getSteps();

    return (
        <div className='stepper'>
            <div className={classes.root}>
                <Stepper alternativeLabel activeStep={activeStep} connector={<QontoConnector />}>
                    {steps.map((label, i) => (
                        <Step key={label}>
                            <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
                            <b>{getStepContent(i)}</b>
                        </Step>
                    ))}
                </Stepper>
            </div>
        </div>
    );
}
