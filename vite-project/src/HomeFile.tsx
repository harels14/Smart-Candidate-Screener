import React, { useState } from 'react';
import {
  Container,
  Title,
  Text,
  Paper,
  Stack,
  SimpleGrid,
  ThemeIcon,
  Group,
  Box,
  FileInput,
  Button,
  Loader,
  Textarea,
  Badge,
  ActionIcon,
  Card,
  Divider,
  Center,
  RingProgress,
} from '@mantine/core';
import {
  IconFileText,
  IconSearch,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconBrain,
  IconTrophy,
  IconAlertCircle,
} from '@tabler/icons-react';
import { Header } from './components/Header';

type Analysis = {
  success: boolean;
  score: number;
  skills: Record<string, string>;
  summary: string;
  error?: string;
};

type Result = {
  file_index: number;
  file_name: string;
  analysis: Analysis;
};

export default function HomeFile() {
  const [files, setFiles] = useState<File[] | undefined>(undefined);
  const [jobDesc, setJobDesc] = useState<string>('');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);

  async function handleUpload() {
    if (!files || files.length === 0) return;

    if (files.length > 20) {
      alert('Maximum 20 candidate resumes can be processed at once.');
      return;
    }

    // Validate files before upload
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const invalidFiles = files.filter(file => {
      const isValidType = file.type === 'application/pdf' || file.type === 'text/plain' || file.name.endsWith('.txt');
      const isValidSize = file.size <= maxFileSize;
      const isNotEmpty = file.size > 0;
      
      if (!isValidType) {
        alert(`Resume "${file.name}" is not in a supported format. Please request PDF or TXT format from candidate.`);
        return true;
      }
      if (!isValidSize) {
        alert(`Resume "${file.name}" is too large (max 10MB). Please request a smaller file from candidate.`);
        return true;
      }
      if (!isNotEmpty) {
        alert(`Resume "${file.name}" appears to be empty.`);
        return true;
      }
      return false;
    });

    if (invalidFiles.length > 0) {
      return;
    }

    setLoading(true);
    setResults([]);
    setCurrentResultIndex(0);
    
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('job_desc', jobDesc);

    try {
      const res = await fetch('http://localhost:8000/api/upload-cvs', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error (${res.status}): ${errorText}`);
      }

      const data = await res.json();

      // sort results by score descending
      const sortedResults = data.results.sort(
        (a: Result, b: Result) => b.analysis.score - a.analysis.score
      );

      setResults(sortedResults);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error processing candidate resumes: ' + error);
    }
    setLoading(false);
  }

  function getScoreColor(score: number) {
    if (score >= 80) return 'green';
    if (score >= 60) return 'yellow';
    if (score >= 40) return 'orange';
    return 'red';
  }

  function getScoreLabel(score: number) {
    if (score >= 90) return 'Perfect Match';
    if (score >= 80) return 'Excellent Fit';
    if (score >= 70) return 'Good Match';
    if (score >= 60) return 'Potential Fit';
    if (score >= 40) return 'Weak Match';
    return 'Poor Fit';
  }

  function Feature({
    icon,
    title,
    text,
  }: {
    icon: React.ReactNode;
    title: string;
    text: string;
  }) {
    return (
      <Card withBorder radius="lg" p="xl" shadow="sm" style={{ height: '100%' }}>
        <Group align="flex-start" mb="md">
          <ThemeIcon
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            radius="xl"
            size="xl"
          >
            {icon}
          </ThemeIcon>
          <div>
            <Text fw={600} size="lg">
              {title}
            </Text>
            <Text c="dimmed" size="sm" mt="xs">
              {text}
            </Text>
          </div>
        </Group>
      </Card>
    );
  }

  const currentResult = results[currentResultIndex];

  return (
    <>
      <Header />
      <Box
        py={60}
        style={{
          background:
            'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%),' +
            'radial-gradient(circle at top left, rgba(59, 130, 246, 0.2), transparent 50%),' +
            'radial-gradient(circle at bottom right, rgba(147, 51, 234, 0.15), transparent 50%),' +
            '#fafafa',
          minHeight: '100vh',
        }}
      >
        <Container size="lg" py="xl">
          {/* Hero Section */}
          <Stack align="center" mb={60} gap="lg">
            <Box style={{ textAlign: 'center' }}>
              <Title
                order={1}
                size="3.5rem"
                fw={900}
                mb="md"
                style={{
                  background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textAlign: 'center'
                }}
              >
                Smart Candidate Screener
              </Title>
              <Text size="lg" c="dimmed" maw={700} mx="auto" lh={1.6}>
                Instantly analyze and rank multiple resumes against your job requirements. 
                Save hours of manual screening with AI-powered candidate matching and scoring.
              </Text>
            </Box>
          </Stack>

          {/* Upload Section */}
          <Paper shadow="xl" radius="xl" withBorder p="xl" mb="xl" 
            style={{ 
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '1px solid #e2e8f0'
            }}
          >
            <Stack gap="lg">
              <Text size="xl" fw={600} ta="center" mb="md">
                📋 Bulk Resume Analysis
              </Text>
              
              <FileInput
                placeholder="📄 Upload candidate resumes (up to 20 files) - PDF or TXT format"
                multiple
                value={files}
                onChange={setFiles}
                accept="application/pdf,text/plain"
                clearable
                size="lg"
                styles={{
                  input: {
                    padding: '20px',
                    borderRadius: '12px',
                    border: '2px dashed #e2e8f0',
                    '&:hover': {
                      borderColor: '#3b82f6',
                    }
                  }
                }}
              />
              
              <Textarea
                label="Job Requirements & Description"
                placeholder="Paste your job posting here for precise candidate matching..."
                value={jobDesc}
                onChange={(event) => setJobDesc(event.currentTarget.value)}
                minRows={4}
                maxRows={8}
                autosize
                size="md"
                styles={{
                  input: {
                    borderRadius: '12px',
                  }
                }}
                description="Include key skills, experience requirements, and qualifications for better candidate scoring"
              />
              
              <Center>
                <Button 
                  onClick={handleUpload} 
                  disabled={loading || !files || files.length === 0} 
                  size="lg"
                  radius="xl"
                  variant="gradient"
                  gradient={{ from: 'blue', to: 'purple', deg: 45 }}
                  leftSection={loading ? <Loader size="sm" /> : <IconBrain size={20} />}
                  style={{ minWidth: 200 }}
                >
                  {loading ? 'Screening Candidates...' : 'Start Candidate Screening'}
                </Button>
              </Center>
            </Stack>
          </Paper>

          {/* Results Section */}
          {results.length > 0 && (
            <Paper shadow="xl" radius="xl" withBorder p="xl" mb="xl"
              style={{ 
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              }}
            >
              <Stack gap="lg">
                <Group justify="space-between" align="center">
                  <div>
                    <Text size="xl" fw={600}>
                      🎯 Candidate Rankings
                    </Text>
                    <Text size="sm" c="dimmed">
                      Sorted by job match score • Processed {results.length} candidate{results.length > 1 ? 's' : ''} in seconds
                    </Text>
                  </div>
                  {results.length > 1 && (
                    <Badge size="lg" variant="light" color="blue">
                      Candidate {currentResultIndex + 1} of {results.length}
                    </Badge>
                  )}
                </Group>

                {results.length > 1 && (
                  <Group justify="center" mb="md">
                    <ActionIcon 
                      variant="light" 
                      size="lg" 
                      radius="xl"
                      onClick={() => setCurrentResultIndex(Math.max(0, currentResultIndex - 1))}
                      disabled={currentResultIndex === 0}
                    >
                      <IconChevronLeft size={18} />
                    </ActionIcon>
                    
                    <Group gap="xs">
                      {results.map((_, index) => (
                        <ActionIcon
                          key={index}
                          variant={index === currentResultIndex ? "filled" : "light"}
                          size="sm"
                          radius="xl"
                          onClick={() => setCurrentResultIndex(index)}
                        >
                          {index + 1}
                        </ActionIcon>
                      ))}
                    </Group>
                    
                    <ActionIcon 
                      variant="light" 
                      size="lg" 
                      radius="xl"
                      onClick={() => setCurrentResultIndex(Math.min(results.length - 1, currentResultIndex + 1))}
                      disabled={currentResultIndex === results.length - 1}
                    >
                      <IconChevronRight size={18} />
                    </ActionIcon>
                  </Group>
                )}

                {currentResult && (
                  <Card withBorder radius="lg" p="xl" shadow="sm">
                    <Stack gap="lg">
                      {/* File Header */}
                      <Group justify="space-between" align="center">
                        <Group gap="md">
                          <Badge size="lg" variant="filled" color="blue" radius="xl">
                            #{currentResultIndex + 1}
                          </Badge>
                          <div>
                            <Text size="lg" fw={700}>
                              👤 {currentResult.file_name.replace(/\.(pdf|txt)$/i, '')}
                            </Text>
                            {files && files[currentResult.file_index] && (
                              <Text size="sm" c="dimmed">
                                {(files[currentResult.file_index].size / 1024).toFixed(1)} KB • 
                                {files[currentResult.file_index].type?.includes('pdf') ? 'PDF Resume' : 'Text Resume'}
                              </Text>
                            )}
                          </div>
                        </Group>
                      </Group>

                      <Divider />

                      {currentResult.analysis.success ? (
                        <Stack gap="xl">
                          {/* Score Section */}
                          <Group justify="center">
                            <RingProgress
                              size={180}
                              thickness={12}
                              sections={[
                                { 
                                  value: Math.max(1, Math.min(100, currentResult.analysis.score)), 
                                  color: getScoreColor(currentResult.analysis.score) 
                                }
                              ]}
                              label={
                                <div style={{ textAlign: 'center' }}>
                                  <Text size="xl" fw={700} c={getScoreColor(currentResult.analysis.score)}>
                                    {Math.max(1, Math.min(100, currentResult.analysis.score))}
                                  </Text>
                                  <Text size="sm" c="dimmed">
                                    Match Score
                                  </Text>
                                </div>
                              }
                            />
                            <Stack gap="xs" align="center">
                              <Badge 
                                size="xl" 
                                variant="light" 
                                color={getScoreColor(currentResult.analysis.score)}
                                leftSection={<IconTrophy size={16} />}
                              >
                                {getScoreLabel(currentResult.analysis.score)}
                              </Badge>
                            </Stack>
                          </Group>

                          {/* Skills Section */}
                          {Object.keys(currentResult.analysis.skills).length > 0 && (
                            <div>
                              <Text size="lg" fw={600} mb="md">
                                ⭐ Relevant Skills Found
                              </Text>
                              <Group gap="xs">
                                {Object.values(currentResult.analysis.skills).map((skill, index) => (
                                  <Badge key={index} variant="light" size="md" color="green">
                                    {skill}
                                  </Badge>
                                ))}
                              </Group>
                            </div>
                          )}

                          {/* Summary Section */}
                          <div>
                            <Text size="lg" fw={600} mb="md">
                              🔍 Candidate Assessment
                            </Text>
                            <Paper withBorder p="md" radius="md" bg="blue.0">
                              <Text lh={1.6}>
                                {currentResult.analysis.summary}
                              </Text>
                            </Paper>
                          </div>
                        </Stack>
                      ) : (
                        <Stack gap="md" align="center">
                          <ThemeIcon color="red" size="xl" radius="xl">
                            <IconAlertCircle size={24} />
                          </ThemeIcon>
                          <Text size="lg" fw={600} c="red" ta="center">
                            ❌ Cannot process this candidate's resume
                          </Text>
                          {currentResult.analysis.error && (
                            <Paper withBorder p="md" radius="md" bg="red.0" style={{ width: '100%' }}>
                              <Text size="sm" ff="monospace" c="red">
                                {currentResult.analysis.error}
                              </Text>
                            </Paper>
                          )}
                          <Text c="dimmed" size="sm" ta="center">
                            • Resume format may not be readable (try requesting PDF/TXT)<br/>
                            • File might be corrupted or password-protected<br/>
                            • Resume contains only images/scanned text<br/>
                            • Contact candidate for alternative format
                          </Text>
                        </Stack>
                      )}
                    </Stack>
                  </Card>
                )}
              </Stack>
            </Paper>
          )}

          {/* Features Section */}
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="xl">
            <Feature
              icon={<IconFileText size={28} />}
              title="Bulk Resume Processing"
              text="Upload up to 20 resumes at once and get instant scoring for all candidates with detailed analysis."
            />
            <Feature
              icon={<IconSearch size={28} />}
              title="Smart Job Matching"
              text="AI compares each candidate against your specific job requirements and ranks them by relevance."
            />
            <Feature
              icon={<IconCheck size={28} />}
              title="Time-Saving Screening"
              text="Reduce hours of manual resume review to minutes. Focus on top candidates with confidence."
            />
          </SimpleGrid>
        </Container>
      </Box>
    </>
  );
}