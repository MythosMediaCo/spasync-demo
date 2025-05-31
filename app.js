// ENHANCED MEDSPASYNC PRO - PROFESSIONAL FEATURES
const { useState, useEffect } = React;

// Time Savings Calculator Component
const TimeSavingsCalculator = () => {
    const [selectedVolume, setSelectedVolume] = useState('medium');
    
    const volumes = {
        small: { transactions: 150, manualHours: 12, description: 'Small Practice', details: '1-2 providers' },
        medium: { transactions: 300, manualHours: 18, description: 'Medium Practice', details: '3-5 providers' },
        large: { transactions: 500, manualHours: 25, description: 'Large Practice', details: '6+ providers' }
    };
    
    const current = volumes[selectedVolume];
    const automatedHours = 0.75; // 45 minutes
    const hourlyRate = 30; // Staff hourly rate
    const savedHours = current.manualHours - automatedHours;
    const monthlySavings = savedHours * hourlyRate;
    const softwareCost = selectedVolume === 'small' ? 99 : selectedVolume === 'medium' ? 199 : 299;
    const netMonthlySavings = monthlySavings - softwareCost;
    const roi = ((netMonthlySavings * 12) / (softwareCost * 12)) * 100;
    
    return React.createElement('div', { className: 'time-savings-calculator' },
        React.createElement('div', { className: 'volume-selector' },
            Object.entries(volumes).map(([key, volume]) =>
                React.createElement('button', {
                    key: key,
                    className: selectedVolume === key ? 'active' : '',
                    onClick: () => setSelectedVolume(key)
                },
                    React.createElement('strong', {}, volume.description),
                    React.createElement('br'),
                    React.createElement('small', {}, volume.details),
                    React.createElement('br'),
                    React.createElement('small', {}, `${volume.transactions} transactions/month`)
                )
            )
        ),
        
        React.createElement('div', { className: 'savings-comparison' },
            React.createElement('div', { className: 'manual-process' },
                React.createElement('h4', {}, '📊 Current Manual Process'),
                React.createElement('div', { className: 'time-display' }, `${current.manualHours} hours/month`),
                React.createElement('ul', {},
                    React.createElement('li', {}, 'Export files from multiple systems'),
                    React.createElement('li', {}, 'Manual name matching in spreadsheets'),
                    React.createElement('li', {}, 'Cross-reference transactions by hand'),
                    React.createElement('li', {}, 'Create reports manually'),
                    React.createElement('li', {}, 'High potential for human error'),
                    React.createElement('li', {}, 'Time-consuming and tedious')
                )
            ),
            
            React.createElement('div', { className: 'automated-process' },
                React.createElement('h4', {}, '🚀 With MedSpaSync Pro'),
                React.createElement('div', { className: 'time-display' }, '45 minutes/month'),
                React.createElement('ul', {},
                    React.createElement('li', {}, 'Automated file processing'),
                    React.createElement('li', {}, 'Smart matching algorithms'),
                    React.createElement('li', {}, 'Instant reconciliation analysis'),
                    React.createElement('li', {}, 'Professional reports generated'),
                    React.createElement('li', {}, '99.5% accuracy guaranteed'),
                    React.createElement('li', {}, 'Focus on patients, not paperwork')
                )
            )
        ),
        
        React.createElement('div', { className: 'savings-summary' },
            React.createElement('div', { className: 'savings-metric' },
                React.createElement('label', {}, 'Hours Saved Monthly'),
                React.createElement('value', {}, savedHours.toFixed(1))
            ),
            React.createElement('div', { className: 'savings-metric' },
                React.createElement('label', {}, 'Net Monthly Savings'),
                React.createElement('value', {}, `$${netMonthlySavings.toFixed(0)}`)
            ),
            React.createElement('div', { className: 'savings-metric highlight' },
                React.createElement('label', {}, 'Annual ROI'),
                React.createElement('value', {}, `${roi.toFixed(0)}%`)
            )
        ),
        
        React.createElement('div', { 
            style: { textAlign: 'center', marginTop: '30px', color: '#6c757d' }
        },
            React.createElement('p', {}, `Software cost: $${softwareCost}/month • Staff time savings: $${monthlySavings.toFixed(0)}/month`)
        )
    );
};

// Professional Demo Component
const ProfessionalDemo = () => {
    const [currentStep, setCurrentStep] = useState('ready');
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [currentMessage, setCurrentMessage] = useState('');
    const [showResults, setShowResults] = useState(false);
    
    const DEMO_RESULTS = {
        processingTime: 47,
        totalTransactions: 279,
        programCount: 3,
        matchRate: 69,
        successfulMatches: 88,
        timeSaved: '15.5 hours',
        itemsForReview: 39,
        dataQualityScore: 82
    };
    
    const startDemo = () => {
        setCurrentStep('analyzing');
        setShowResults(false);
        
        // Show the results section
        document.getElementById('results-section').style.display = 'block';
        
        const progressSteps = [
            { progress: 15, message: 'Uploading and parsing POS transaction files...' },
            { progress: 30, message: 'Processing Alle rewards program data...' },
            { progress: 45, message: 'Analyzing Aspire certificate records...' },
            { progress: 60, message: 'Running advanced matching algorithms...' },
            { progress: 75, message: 'Detecting process improvement opportunities...' },
            { progress: 90, message: 'Generating professional reports...' },
            { progress: 100, message: 'Analysis complete! Preparing results...' }
        ];
        
        progressSteps.forEach((step, index) => {
            setTimeout(() => {
                setAnalysisProgress(step.progress);
                setCurrentMessage(step.message);
                if (step.progress === 100) {
                    setTimeout(() => {
                        setShowResults(true);
                        setCurrentStep('results');
                        updateResultsSection(DEMO_RESULTS);
                    }, 1000);
                }
            }, (index + 1) * 800);
        });
    };
    
    const updateResultsSection = (results) => {
        // Update your existing results section with realistic data
        document.getElementById('hours-saved').textContent = results.timeSaved;
        document.getElementById('missed-revenue').textContent = '$2,340';
        document.getElementById('annual-savings').textContent = '$28,080';
        
        // Update the discrepancy table with realistic findings
        const tableBody = document.querySelector('#discrepancy-table tbody');
        tableBody.innerHTML = `
            <tr>
                <td><span style="color: #ff8800; font-weight: bold;">⚠️ Process Review</span></td>
                <td>Multiple Patients</td>
                <td>May 2025</td>
                <td>39 transactions</td>
                <td>POS transactions requiring manual review for optimal matching</td>
            </tr>
            <tr>
                <td><span style="color: #4caf50; font-weight: bold;">✅ Quality Score</span></td>
                <td>System Analysis</td>
                <td>-</td>
                <td>69% automated</td>
                <td>Good correlation rate achieved with smart matching algorithms</td>
            </tr>
            <tr>
                <td><span style="color: #2196f3; font-weight: bold;">💡 Opportunity</span></td>
                <td>Data Standardization</td>
                <td>-</td>
                <td>15% improvement</td>
                <td>Staff training on consistent patient name entry could improve match rate</td>
            </tr>
            <tr>
                <td><span style="color: #764ba2; font-weight: bold;">📊 Time Savings</span></td>
                <td>Process Efficiency</td>
                <td>-</td>
                <td>15.5 hours/month</td>
                <td>Automated reconciliation vs manual process saves significant staff time</td>
            </tr>
        `;
    };
    
    if (currentStep === 'ready') {
        return React.createElement('div', { className: 'demo-ready' },
            React.createElement('div', { style: { textAlign: 'center' }},
                React.createElement('button', { 
                    className: 'cta-button', 
                    onClick: startDemo 
                }, '🚀 Start Professional Demo Analysis'),
                React.createElement('p', { 
                    style: { marginTop: '15px', fontSize: '0.9rem', color: '#6c757d' }
                }, 'Based on real medical spa data • Takes 45 seconds')
            ),
            
            React.createElement('div', { 
                style: { 
                    marginTop: '40px', 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '20px' 
                }
            },
                React.createElement('div', { 
                    style: { padding: '20px', background: '#f8f9fa', borderRadius: '10px', textAlign: 'center' }
                },
                    React.createElement('strong', { style: { color: '#667eea' }}, '📊 279 Transactions'),
                    React.createElement('br'),
                    React.createElement('small', {}, 'Real POS and rewards data')
                ),
                React.createElement('div', { 
                    style: { padding: '20px', background: '#f8f9fa', borderRadius: '10px', textAlign: 'center' }
                },
                    React.createElement('strong', { style: { color: '#667eea' }}, '🎯 3 Programs'),
                    React.createElement('br'),
                    React.createElement('small', {}, 'Alle, Aspire, Certificates')
                ),
                React.createElement('div', { 
                    style: { padding: '20px', background: '#f8f9fa', borderRadius: '10px', textAlign: 'center' }
                },
                    React.createElement('strong', { style: { color: '#667eea' }}, '⚡ 47 Seconds'),
                    React.createElement('br'),
                    React.createElement('small', {}, 'Complete analysis time')
                )
            )
        );
    }
    
    if (currentStep === 'analyzing') {
        return React.createElement('div', { className: 'analysis-progress' },
            React.createElement('h4', { 
                style: { color: '#333', marginBottom: '30px' }
            }, '⚙️ Analyzing Your Rewards Data'),
            
            React.createElement('div', { style: { margin: '30px 0' }},
                React.createElement('div', { 
                    style: { background: '#e9ecef', borderRadius: '10px', height: '25px', overflow: 'hidden' }
                },
                    React.createElement('div', { 
                        style: { 
                            background: 'linear-gradient(135deg, #667eea, #764ba2)',
                            height: '100%',
                            width: `${analysisProgress}%`,
                            transition: 'width 0.8s ease-out',
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold'
                        }
                    }, `${analysisProgress}%`)
                ),
                React.createElement('div', { 
                    style: { textAlign: 'center', marginTop: '15px' }
                },
                    React.createElement('strong', { 
                        style: { color: '#333', fontSize: '1.1rem' }
                    }, `${analysisProgress}% Complete`)
                ),
                React.createElement('div', { 
                    style: { textAlign: 'center', marginTop: '8px', color: '#6c757d', fontStyle: 'italic' }
                }, currentMessage)
            ),
            
            React.createElement('div', { 
                style: { 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: '20px', 
                    marginTop: '40px' 
                }
            },
                React.createElement('div', { 
                    style: { textAlign: 'center', padding: '20px', background: '#f0f4ff', borderRadius: '10px' }
                },
                    React.createElement('div', { style: { fontSize: '2rem', marginBottom: '10px' }}, '📊'),
                    React.createElement('div', {}, React.createElement('strong', {}, 'Processing Files')),
                    React.createElement('small', {}, 'POS, Alle, Aspire data')
                ),
                React.createElement('div', { 
                    style: { textAlign: 'center', padding: '20px', background: '#f0f4ff', borderRadius: '10px' }
                },
                    React.createElement('div', { style: { fontSize: '2rem', marginBottom: '10px' }}, '🧠'),
                    React.createElement('div', {}, React.createElement('strong', {}, 'Smart Matching')),
                    React.createElement('small', {}, 'Advanced algorithms running')
                ),
                React.createElement('div', { 
                    style: { textAlign: 'center', padding: '20px', background: '#f0f4ff', borderRadius: '10px' }
                },
                    React.createElement('div', { style: { fontSize: '2rem', marginBottom: '10px' }}, '📋'),
                    React.createElement('div', {}, React.createElement('strong', {}, 'Generating Reports')),
                    React.createElement('small', {}, 'Professional documentation')
                )
            )
        );
    }
    
    if (currentStep === 'results' && showResults) {
        return React.createElement('div', { className: 'demo-results' },
            React.createElement('div', { style: { textAlign: 'center', marginBottom: '30px' }},
                React.createElement('h4', { 
                    style: { color: '#4caf50', fontSize: '1.8rem', marginBottom: '10px' }
                }, '✅ Professional Analysis Complete!'),
                React.createElement('p', { 
                    style: { color: '#6c757d', fontSize: '1.1rem' }
                }, `Reconciliation completed in ${DEMO_RESULTS.processingTime} seconds with professional accuracy`)
            ),
            
            React.createElement('div', { style: { 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                gap: '25px', 
                margin: '40px 0',
                maxWidth: '900px',
                marginLeft: 'auto',
                marginRight: 'auto'
            }},
                React.createElement('div', { style: { 
                    background: 'white', 
                    padding: '25px', 
                    borderRadius: '15px', 
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)', 
                    textAlign: 'center',
                    border: '2px solid #e9ecef'
                }},
                    React.createElement('div', { 
                        style: { fontSize: '2.5rem', fontWeight: '700', color: '#667eea', marginBottom: '10px' }
                    }, DEMO_RESULTS.totalTransactions),
                    React.createElement('div', { 
                        style: { fontSize: '1rem', color: '#333', fontWeight: '600', marginBottom: '5px' }
                    }, 'Transactions Processed'),
                    React.createElement('div', { 
                        style: { fontSize: '0.9rem', color: '#6c757d' }
                    }, `Across ${DEMO_RESULTS.programCount} reward programs`)
                ),
                
                React.createElement('div', { style: { 
                    background: 'white', 
                    padding: '25px', 
                    borderRadius: '15px', 
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)', 
                    textAlign: 'center',
                    border: '2px solid #e9ecef'
                }},
                    React.createElement('div', { 
                        style: { fontSize: '2.5rem', fontWeight: '700', color: '#4caf50', marginBottom: '10px' }
                    }, `${DEMO_RESULTS.matchRate}%`),
                    React.createElement('div', { 
                        style: { fontSize: '1rem', color: '#333', fontWeight: '600', marginBottom: '5px' }
                    }, 'Automated Match Rate'),
                    React.createElement('div', { 
                        style: { fontSize: '0.9rem', color: '#6c757d' }
                    }, `${DEMO_RESULTS.successfulMatches} successful correlations`)
                ),
                
                React.createElement('div', { style: { 
                    background: 'white', 
                    padding: '25px', 
                    borderRadius: '15px', 
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)', 
                    textAlign: 'center',
                    border: '2px solid #e9ecef'
                }},
                    React.createElement('div', { 
                        style: { fontSize: '2.5rem', fontWeight: '700', color: '#ff8800', marginBottom: '10px' }
                    }, DEMO_RESULTS.timeSaved),
                    React.createElement('div', { 
                        style: { fontSize: '1rem', color: '#333', fontWeight: '600', marginBottom: '5px' }
                    }, 'Time Saved Monthly'),
                    React.createElement('div', { 
                        style: { fontSize: '0.9rem', color: '#6c757d' }
                    }, 'vs manual reconciliation')
                )
            ),
            
            React.createElement('div', { style: { 
                background: '#f8f9fa', 
                padding: '30px', 
                borderRadius: '15px', 
                margin: '40px 0',
                border: '1px solid #e9ecef'
            }},
                React.createElement('h4', { 
                    style: { marginBottom: '20px', color: '#333', textAlign: 'center' }
                }, '🎯 Key Professional Insights'),
                React.createElement('div', { style: { display: 'grid', gap: '15px' }},
                    React.createElement('div', { 
                        style: { display: 'flex', alignItems: 'center', padding: '15px', background: 'white', borderRadius: '8px' }
                    },
                        React.createElement('span', { style: { marginRight: '15px', fontSize: '1.5rem' }}, '📈'),
                        React.createElement('div', {},
                            React.createElement('strong', {}, 'Process Efficiency: '),
                            '69% automated matching indicates well-structured data and good system alignment for your practice size.'
                        )
                    ),
                    React.createElement('div', { 
                        style: { display: 'flex', alignItems: 'center', padding: '15px', background: 'white', borderRadius: '8px' }
                    },
                        React.createElement('span', { style: { marginRight: '15px', fontSize: '1.5rem' }}, '🔍'),
                        React.createElement('div', {},
                            React.createElement('strong', {}, 'Manual Review Items: '),
                            '39 transactions flagged for staff review - typical for complex multi-program reconciliation.'
                        )
                    ),
                    React.createElement('div', { 
                        style: { display: 'flex', alignItems: 'center', padding: '15px', background: 'white', borderRadius: '8px' }
                    },
                        React.createElement('span', { style: { marginRight: '15px', fontSize: '1.5rem' }}, '⚡'),
                        React.createElement('div', {},
                            React.createElement('strong', {}, 'Operational Impact: '),
                            'Reduced reconciliation from 18+ hours to 45 minutes with professional audit-ready documentation.'
                        )
                    )
                )
            ),
            
            React.createElement('div', { style: { textAlign: 'center', marginTop: '40px' }},
                React.createElement('h4', { 
                    style: { marginBottom: '25px', color: '#333' }
                }, '🚀 Ready to Streamline Your Operations?'),
                React.createElement('div', { 
                    style: { display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }
                },
                    React.createElement('button', { 
                        className: 'cta-button',
                        onClick: () => window.open('mailto:sales@mythosmedia.co?subject=MedSpaSync Pro - Free Trial Request&body=I would like to start a free trial of MedSpaSync Pro based on the demo analysis.', '_blank')
                    }, 'Start Free 30-Day Trial'),
                    React.createElement('button', { 
                        className: 'cta-button',
                        style: { background: 'linear-gradient(90deg, #17a2b8, #138496)' },
                        onClick: () => setCurrentStep('ready')
                    }, 'Run Another Analysis')
                ),
                
                React.createElement('div', { style: { 
                    marginTop: '30px', 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '15px',
                    maxWidth: '800px',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }},
                    React.createElement('div', { style: { color: '#4caf50', fontWeight: '600' }}, '✅ Save 15+ hours monthly'),
                    React.createElement('div', { style: { color: '#4caf50', fontWeight: '600' }}, '✅ Professional audit docs'),
                    React.createElement('div', { style: { color: '#4caf50', fontWeight: '600' }}, '✅ 99.5% accuracy guaranteed'),
                    React.createElement('div', { style: { color: '#4caf50', fontWeight: '600' }}, '✅ No setup fees')
                )
            )
        );
    }
    
    return null;
};

// Render the new professional components
if (document.getElementById('timeSavingsCalculator')) {
    ReactDOM.render(React.createElement(TimeSavingsCalculator), document.getElementById('timeSavingsCalculator'));
}
if (document.getElementById('professionalDemo')) {
    ReactDOM.render(React.createElement(ProfessionalDemo), document.getElementById('professionalDemo'));
}

// YOUR EXISTING JAVASCRIPT FUNCTIONALITY BELOW
// Keep all your existing file upload, drag/drop, and analysis functions

// File upload functionality
let uploadedFiles = [];

// Drag and drop functionality
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    document.getElementById('drop-area').addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

['dragenter', 'dragover'].forEach(eventName => {
    document.getElementById('drop-area').addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    document.getElementById('drop-area').addEventListener(eventName, unhighlight, false);
});

document.getElementById('drop-area').addEventListener('drop', handleDrop, false);

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function highlight(e) {
    document.getElementById('drop-area').classList.add('drag-over');
}

function unhighlight(e) {
    document.getElementById('drop-area').classList.remove('drag-over');
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

document.getElementById('fileElem').addEventListener('change', function(e) {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    [...files].forEach(uploadFile);
}

function uploadFile(file) {
    uploadedFiles.push(file);
    updateFileList();
}

function updateFileList() {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';
    
    uploadedFiles.forEach((file, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span class="file-name">${file.name} (${(file.size / 1024).toFixed(1)} KB)</span>
            <button class="remove-file" onclick="removeFile(${index})">×</button>
        `;
        fileList.appendChild(li);
    });
}

function removeFile(index) {
    uploadedFiles.splice(index, 1);
    updateFileList();
}

function loadSampleData() {
    uploadedFiles = [
        { name: 'POS_Transactions_Sample.csv', size: 45120 },
        { name: 'Alle_Rewards_Sample.csv', size: 23456 },
        { name: 'Aspire_Certificates_Sample.csv', size: 18934 }
    ];
    updateFileList();
    
    setTimeout(() => {
        runAnalysis();
    }, 1000);
}

function runAnalysis() {
    if (uploadedFiles.length === 0) {
        alert('Please upload files or load sample data first.');
        return;
    }
    
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const resultsSection = document.getElementById('results-section');
    
    progressContainer.style.display = 'block';
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            setTimeout(() => {
                progressContainer.style.display = 'none';
                resultsSection.style.display = 'block';
                populateResults();
                resultsSection.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
        
        progressBar.style.width = progress + '%';
        progressBar.textContent = Math.round(progress) + '%';
    }, 200);
}

function populateResults() {
    document.getElementById('hours-saved').textContent = '16.2';
    document.getElementById('missed-revenue').textContent = '$3,240';
    document.getElementById('annual-savings').textContent = '$38,880';
    
    const tableBody = document.querySelector('#discrepancy-table tbody');
    tableBody.innerHTML = `
        <tr>
            <td><span style="color: #f44336; font-weight: bold;">Missing Claim</span></td>
            <td>Sarah Johnson</td>
            <td>2025-05-15</td>
            <td>$85.00</td>
            <td>Botox treatment eligible for Alle rewards - claim not submitted</td>
        </tr>
        <tr>
            <td><span style="color: #ff9800; font-weight: bold;">Date Mismatch</span></td>
            <td>Michael Chen</td>
            <td>2025-05-22</td>
            <td>$120.00</td>
            <td>Aspire certificate processed 3 days after treatment - review timing</td>
        </tr>
        <tr>
            <td><span style="color: #f44336; font-weight: bold;">Missing Claim</span></td>
            <td>Jennifer Davis</td>
            <td>2025-05-18</td>
            <td>$200.00</td>
            <td>CoolSculpting session eligible for Alle points - no rewards applied</td>
        </tr>
        <tr>
            <td><span style="color: #2196f3; font-weight: bold;">Process Gap</span></td>
            <td>Multiple Patients</td>
            <td>May 2025</td>
            <td>$1,200.00</td>
            <td>15 transactions require manual review for optimal reward application</td>
        </tr>
    `;
}

function exportReport() {
    const reportContent = `
MedSpaSync Pro - Reconciliation Report
Generated: ${new Date().toLocaleDateString()}

SUMMARY:
- Hours Saved: 16.2 per week
- Missed Revenue Identified: $3,240
- Annual Projected Savings: $38,880

RECOMMENDATIONS:
1. Submit missing Alle claims for eligible treatments
2. Review Aspire certificate processing timing
3. Implement staff training on reward program applications
4. Consider automated reconciliation for ongoing efficiency

This report was generated by MedSpaSync Pro.
Contact: sales@mythosmedia.co
    `;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'medspasync-reconciliation-report.txt';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}

function scheduleDemo() {
    window.open('mailto:sales@mythosmedia.co?subject=MedSpaSync Pro Demo Request&body=I would like to schedule a personalized demo of MedSpaSync Pro for my medical spa practice.', '_blank');
}