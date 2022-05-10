import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Paper,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import "./Multistep.css";

const Multistep = (props) => {
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
    // props.submitAnswers();
  };
  const steps = [
    {
      label: "Επιλέξτε κύριο συστατικό",
      description: (
        <FormControl>
          <RadioGroup
            aria-labelledby="controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={value}
            onChange={handleChange}
          >
            <FormControlLabel
              value="vodka"
              control={<Radio size="small" />}
              label="Vodka"
            />
            <FormControlLabel
              value="gin"
              control={<Radio size="small" />}
              label="Gin"
            />
            <FormControlLabel
              value="rum"
              control={<Radio size="small" />}
              label="Rum"
            />
          </RadioGroup>
        </FormControl>
      ),
    },
    {
      label: "Επιλέξτε γευστικό αποτέλεσμα",
      description: (
        <FormControl>
          <RadioGroup
            aria-labelledby="controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={value}
            onChange={handleChange}
          >
            <FormControlLabel
              value="sweet"
              control={<Radio size="small" />}
              label="Sweet"
            />
            <FormControlLabel
              value="sour"
              control={<Radio size="small" />}
              label="Sour"
            />
            <FormControlLabel
              value="bitter"
              control={<Radio size="small" />}
              label="Bitter"
            />
            <FormControlLabel
              value="salty"
              control={<Radio size="small" />}
              label="Salty"
            />
            <FormControlLabel
              value="anything"
              control={<Radio size="small" />}
              label="Anything"
            />
          </RadioGroup>
        </FormControl>
      ),
    },
  ];

  return (
    <Box sx={{ maxWidth: 400 }} className="multistep-form">
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 2 ? (
                  <Typography variant="caption">Τελευταίο Βήμα</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              {step.description}
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button
                    className="next-button"
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? "Τέλος" : "Συνέχεια"}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Πίσω
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }}>
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default Multistep;
