"use client";

import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
} from '@mui/material';
import {
  AccessTime,
  Coffee,
  Assignment,
  Info,
  Warning,
  Schedule,
  Group,
  WorkOutline,
} from '@mui/icons-material';

// Demo data for the timetable
const scheduleData = {
  departments: [
    {
      name: "Development Team",
      schedule: {
        morningShift: "10:00 AM - 1:00 PM",
        breakTime: "1:00 PM - 2:00 PM",
        afternoonShift: "2:00 PM - 7:00 PM",
        tasks: [
          "Code reviews and team sync (10:00 - 10:30)",
          "Core development work (10:30 - 1:00)",
          "Project planning and documentation (2:00 - 3:30)",
          "Focused development time (3:30 - 7:00)"
        ]
      }
    },
    {
      name: "Design Team",
      schedule: {
        morningShift: "10:00 AM - 1:00 PM",
        breakTime: "1:00 PM - 2:00 PM",
        afternoonShift: "2:00 PM - 7:00 PM",
        tasks: [
          "Design review meeting (10:00 - 10:30)",
          "UI/UX work (10:30 - 1:00)",
          "Collaboration with dev team (2:00 - 3:30)",
          "Design implementation (3:30 - 7:00)"
        ]
      }
    }
  ],
  guidelines: [
    {
      title: "Core Hours",
      description: "All team members must be available during core hours (11 AM - 4 PM) for meetings and collaboration."
    },
    {
      title: "Break Policy",
      description: "Lunch break is mandatory and should be taken between 1-2 PM to ensure team synchronization."
    },
    {
      title: "Flexible Hours",
      description: "Team members can adjust their start/end times by ±1 hour with manager approval."
    },
    {
      title: "Meeting Schedule",
      description: "Team meetings should be scheduled between 10:30 AM - 12:30 PM to respect focus time."
    }
  ]
};

const TimeTableTab = () => {
  return (
    <Box sx={{ p: 3, maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Schedule /> Employee Timetable
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Daily schedule and work guidelines for all departments
        </Typography>
      </Box>

      {/* Department Schedules */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {scheduleData.departments.map((dept, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card sx={{ height: '100%', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Group /> {dept.name}
                </Typography>

                <TableContainer component={Paper} elevation={0}>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell sx={{ borderBottom: 'none' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime color="primary" />
                            <Typography variant="body2">Morning Shift</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottom: 'none' }}>
                          <Chip label={dept.schedule.morningShift} color="primary" variant="outlined" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ borderBottom: 'none' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Coffee color="warning" />
                            <Typography variant="body2">Break Time</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottom: 'none' }}>
                          <Chip label={dept.schedule.breakTime} color="warning" variant="outlined" />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell sx={{ borderBottom: 'none' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AccessTime color="primary" />
                            <Typography variant="body2">Afternoon Shift</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottom: 'none' }}>
                          <Chip label={dept.schedule.afternoonShift} color="primary" variant="outlined" />
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Assignment /> Daily Tasks
                  </Typography>
                  <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                    {dept.schedule.tasks.map((task, i) => (
                      <Box key={i} sx={{ mb: i < dept.schedule.tasks.length - 1 ? 1 : 0 }}>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <WorkOutline fontSize="small" />
                          {task}
                        </Typography>
                      </Box>
                    ))}
                  </Paper>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Guidelines */}
      <Card sx={{ mb: 4, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Info /> Work Guidelines
          </Typography>
          <Grid container spacing={3}>
            {scheduleData.guidelines.map((guideline, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    {guideline.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {guideline.description}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card sx={{ bgcolor: 'primary.light', boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
            <Warning /> Important Notes
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              All times are in local timezone (GMT+5)
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              Schedule flexibility depends on team requirements and ongoing projects
            </Typography>
            <Typography component="li" variant="body2" sx={{ mb: 1 }}>
              Remote work requests should be submitted at least 24 hours in advance
            </Typography>
            <Typography component="li" variant="body2">
              Core hours are mandatory unless specifically exempted by management
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default TimeTableTab;