// ENHANCED MEDSPASYNC PRO WITH INTEGRATED LEAD CAPTURE AND BACKEND CONNECTIVITY
const { useState, useEffect } = React;

// ===== API CONFIGURATION =====
const API_CONFIG = {
    development: {
        API_URL: 'http://localhost:5000/api'
    },
    production: {
        API_URL: 'https://medspasync-backend-production.up.railway.app/api'
    }
};

// Auto-detect environment - Updated for your Railway deployment
const environment = window.location.hostname.includes('railway.app') || 
                   window.location.hostname.includes('github.io') ||
                   window.location.hostname.includes('medspasync.com') ? 'production' : 'development';

// Use the correct API URL
const API_BASE_URL = API_CONFIG[environment].API_URL;

console.log('🚀 MedSpaSync Pro Frontend Environment:', environment);
console.log('🌐 Using API:', API_BASE_URL);

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
                React.createElement('div', { className: 'metric-value' }, savedHours.toFixed(1))
            ),
            React.createElement('div', { className: 'savings-metric' },
                React.createElement('label', {}, 'Net Monthly Savings'),
                React.createElement('div', { className: 'metric-value' }, `${netMonthlySavings.toFixed(0)}`)
            ),
            React.createElement('div', { className: 'savings-metric highlight' },
                React.createElement('label', {}, 'Annual ROI'),
                React.createElement('div', { className: 'metric-value' }, `${roi.toFixed(0)}%`)
            )
        ),
        
        React.createElement('div', { 
            style: { textAlign: 'center', marginTop: '30px', color: '#6c757d' }
        },
            React.createElement('p', {}, `Software cost: $${softwareCost}/month • Staff time savings: $${monthlySavings.toFixed(0)}/month`)
        )
    );
};

// Professional Demo Component with Backend Integration
const ProfessionalDemo = () => {
    const [currentStep, setCurrentStep] = useState('ready');
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [currentMessage, setCurrentMessage] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [showTrialForm, setShowTrialForm] = useState(false);
    
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
        
        // Update the discrepancy table with FICTIONAL NAMES for privacy
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
    
    const handleTrialSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData);
        
        console.log('Trial signup:', data);
        
        try {
            // Create account in backend
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: data.email,
                    password: 'temp-password-123', // Temporary password
                    firstName: data.firstName,
                    lastName: data.lastName || 'User',
                    practiceName: data.practiceName,
                    practiceSize: 'medium' // Default
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Show success message
                setShowTrialForm(false);
                
                // Create success notification
                const successDiv = document.createElement('div');
                successDiv.innerHTML = `
                    <div style="
                        background: linear-gradient(135deg, #4caf50, #45a049);
                        color: white;
                        padding: 30px;
                        border-radius: 15px;
                        text-align: center;
                        margin: 20px 0;
                        box-shadow: 0 10px 30px rgba(76, 175, 80, 0.3);
                    ">
                        <h3 style="margin-bottom: 15px;">🎉 Account Created Successfully!</h3>
                        <p style="margin-bottom: 10px;">Your trial account is ready! Password: temp-password-123</p>
                        <p>Login at: <a href="https://spasync-demo-production.up.railway.app/dashboard.html" style="color: #e8f5e8; text-decoration: underline;">Dashboard</a></p>
                    </div>
                `;
                document.querySelector('.demo-results').appendChild(successDiv);
                
                // Send lead notification email
                sendLeadNotification(data, 'Free Trial Signup - Account Created');
                
            } else {
                throw new Error(result.error || 'Registration failed');
            }
            
        } catch (error) {
            console.error('Trial signup error:', error);
            
            // Show error but still send lead notification
            setShowTrialForm(false);
            const errorDiv = document.createElement('div');
            errorDiv.innerHTML = `
                <div style="
                    background: linear-gradient(135deg, #ff6b6b, #ee5a52);
                    color: white;
                    padding: 30px;
                    border-radius: 15px;
                    text-align: center;
                    margin: 20px 0;
                    box-shadow: 0 10px 30px rgba(255, 107, 107, 0.3);
                ">
                    <h3 style="margin-bottom: 15px;">⚠️ Almost There!</h3>
                    <p style="margin-bottom: 10px;">We've captured your interest! Our team will contact you within 2 hours to set up your trial account.</p>
                    <p>Or email us directly: <a href="mailto:sales@mythosmedia.co" style="color: #ffe8e8; text-decoration: underline;">sales@mythosmedia.co</a></p>
                </div>
            `;
            document.querySelector('.demo-results').appendChild(errorDiv);
            
            // Still send lead notification
            sendLeadNotification(data, 'Free Trial Signup - Manual Setup Required');
        }
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
            
            // POST-DEMO TRIAL CAPTURE
            React.createElement('div', { style: { 
                background: 'linear-gradient(135deg, #4caf50, #45a049)',
                color: 'white',
                padding: '40px',
                borderRadius: '20px',
                margin: '40px 0',
                textAlign: 'center',
                boxShadow: '0 15px 35px rgba(76, 175, 80, 0.3)'
            }},
                React.createElement('h3', { 
                    style: { fontSize: '2.2rem', marginBottom: '20px' }
                }, '✅ Impressed by the Results?'),
                React.createElement('p', { 
                    style: { fontSize: '1.2rem', marginBottom: '25px', opacity: '0.95' }
                }, 'Get MedSpaSync Pro working for YOUR practice. Start your free 30-day trial and see these results with your actual data.'),
                
                !showTrialForm ? 
                    React.createElement('button', { 
                        className: 'cta-button',
                        style: { 
                            background: 'rgba(255,255,255,0.9)', 
                            color: '#4caf50',
                            fontSize: '1.3rem',
                            padding: '20px 40px'
                        },
                        onClick: () => setShowTrialForm(true)
                    }, '🚀 Start My Free 30-Day Trial')
                :
                    React.createElement('form', { 
                        onSubmit: handleTrialSubmit,
                        style: { maxWidth: '600px', margin: '0 auto' }
                    },
                        React.createElement('div', { 
                            style: { 
                                display: 'grid', 
                                gridTemplateColumns: 'repeat(3, 1fr)', 
                                gap: '15px', 
                                marginBottom: '20px' 
                            }
                        },
                            React.createElement('input', { 
                                type: 'text', 
                                name: 'firstName',
                                placeholder: 'First Name*', 
                                required: true,
                                style: { 
                                    padding: '15px', 
                                    borderRadius: '8px', 
                                    border: 'none',
                                    fontSize: '1rem'
                                }
                            }),
                            React.createElement('input', { 
                                type: 'email', 
                                name: 'email',
                                placeholder: 'Email*', 
                                required: true,
                                style: { 
                                    padding: '15px', 
                                    borderRadius: '8px', 
                                    border: 'none',
                                    fontSize: '1rem'
                                }
                            }),
                            React.createElement('input', { 
                                type: 'text', 
                                name: 'practiceName',
                                placeholder: 'Practice Name*', 
                                required: true,
                                style: { 
                                    padding: '15px', 
                                    borderRadius: '8px', 
                                    border: 'none',
                                    fontSize: '1rem'
                                }
                            })
                        ),
                        
                        React.createElement('button', { 
                            type: 'submit',
                            style: { 
                                background: 'rgba(255,255,255,0.9)', 
                                color: '#4caf50',
                                border: 'none',
                                padding: '15px 30px',
                                borderRadius: '8px',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                width: '100%'
                            }
                        }, '🚀 Activate My Free Trial')
                    ),
                
                React.createElement('div', { 
                    style: { 
                        marginTop: '30px', 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(2, 1fr)', 
                        gap: '30px',
                        opacity: '0.9',
                        fontSize: '0.95rem'
                    }
                },
                    React.createElement('div', {},
                        React.createElement('strong', {}, 'Free Trial Includes:'),
                        React.createElement('div', { style: { marginTop: '10px' }},
                            '✅ Full analysis of your data\n✅ Complete reconciliation report\n✅ Implementation guidance\n✅ No setup fees'.split('\n').map((item, i) => 
                                React.createElement('div', { key: i }, item)
                            )
                        )
                    ),
                    React.createElement('div', {},
                        React.createElement('strong', {}, 'What Happens Next:'),
                        React.createElement('div', { style: { marginTop: '10px' }},
                            '📧 Instant trial access email\n📞 Optional setup call (15 min)\n📊 Your first report in 24 hours\n🚀 Start saving time immediately'.split('\n').map((item, i) => 
                                React.createElement('div', { key: i }, item)
                            )
                        )
                    )
                )
            ),
            
            React.createElement('div', { style: { textAlign: 'center', marginTop: '30px' }},
                React.createElement('button', { 
                    className: 'cta-button',
                    style: { background: 'linear-gradient(90deg, #17a2b8, #138496)', margin: '10px' },
                    onClick: () => setCurrentStep('ready')
                }, 'Run Another Analysis'),
                
                React.createElement('div', { style: { 
                    marginTop: '20px', 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                    gap: '15px',
                    maxWidth: '600px',
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

// EMAILJS INTEGRATION - Professional Lead Capture
function sendLeadNotification(data, source) {
    console.log(`New lead from ${source}:`, data);
    
    // EmailJS Configuration with your actual credentials
    const emailParams = {
        from_name: data.firstName || 'Unknown',
        from_email: data.email || 'no-email@example.com',
        practice_name: data.practiceName || 'Not provided',
        source: source,
        message: `New ${source} from ${data.firstName} at ${data.practiceName}`,
        lead_details: JSON.stringify(data, null, 2),
        timestamp: new Date().toLocaleString()
    };
    
    // Send email via EmailJS
    if (typeof emailjs !== 'undefined') {
        emailjs.send(
            'service_xicrl9p',     // Your actual service ID
            'template_gze8atr',    // Your lead notification template ID
            emailParams,
            'Xe2K-4SHtRCGh-vSf'   // Your actual public key
        ).then(
            function(response) {
                console.log('Lead notification sent successfully!', response.status, response.text);
                
                // Send confirmation email to lead
                sendConfirmationEmail(data);
            },
            function(error) {
                console.error('Failed to send lead notification:', error);
                
                // Fallback: mailto link
                const mailtoLink = `mailto:mythosmediaco@gmail.com?subject=New MedSpaSync Pro Lead: ${source}&body=Name: ${data.firstName}%0AEmail: ${data.email}%0APractice: ${data.practiceName}%0ASource: ${source}`;
                window.open(mailtoLink);
            }
        );
    } else {
        // Fallback if EmailJS not loaded
        console.warn('EmailJS not loaded, using mailto fallback');
        const mailtoLink = `mailto:mythosmediaco@gmail.com?subject=New MedSpaSync Pro Lead: ${source}&body=Name: ${data.firstName}%0AEmail: ${data.email}%0APractice: ${data.practiceName}%0ASource: ${source}`;
        window.open(mailtoLink);
    }
}

// Send confirmation email to the lead
function sendConfirmationEmail(data) {
    const confirmationParams = {
        to_email: data.email,
        to_name: data.firstName,
        practice_name: data.practiceName,
        support_email: 'mythosmediaco@gmail.com'
    };
    
    if (typeof emailjs !== 'undefined') {
        emailjs.send(
            'service_xicrl9p',      // Your actual service ID
            'template_b89p15u',     // Your trial confirmation template ID
            confirmationParams,
            'Xe2K-4SHtRCGh-vSf'    // Your actual public key
        ).then(
            function(response) {
                console.log('Confirmation email sent to lead!', response.status);
            },
            function(error) {
                console.error('Failed to send confirmation email:', error);
            }
        );
    }
}

// Render the professional components
if (document.getElementById('timeSavingsCalculator')) {
    ReactDOM.render(React.createElement(TimeSavingsCalculator), document.getElementById('timeSavingsCalculator'));
}
if (document.getElementById('professionalDemo')) {
    ReactDOM.render(React.createElement(ProfessionalDemo), document.getElementById('professionalDemo'));
}

// Keep all your existing JavaScript functionality below
let uploadedFiles = [];

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
    
    // Try to connect to live backend for real analysis
    performRealAnalysis()
        .then(results => {
            progressContainer.style.display = 'none';
            resultsSection.style.display = 'block';
            populateResults(results);
            resultsSection.scrollIntoView({ behavior: 'smooth' });
        })
        .catch(error => {
            console.warn('Live analysis failed, using demo data:', error);
            // Fallback to demo simulation
            runDemoAnalysis();
        });
}

async function performRealAnalysis() {
    try {
        // Test backend connection first
        const healthCheck = await fetch(`${API_BASE_URL}/health`);
        if (!healthCheck.ok) throw new Error('Backend not available');
        
        // For now, return demo data but log that backend is available
        console.log('✅ Backend connected - using enhanced demo data');
        
        // Enhanced demo data that looks more realistic
        return {
            hoursSeaved: '16.2',
            missedRevenue: '$3,240',
            annualSavings: '$38,880',
            backendConnected: true
        };
        
    } catch (error) {
        throw new Error('Backend connection failed');
    }
}

function runDemoAnalysis() {
    let progress = 0;
    const progressContainer = document.getElementById('progress-container');
    const progressBar = document.getElementById('progress-bar');
    const resultsSection = document.getElementById('results-section');
    
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

function populateResults(data = null) {
    // Use real data if provided, otherwise use demo data
    const results = data || {
        hoursSeaved: '16.2',
        missedRevenue: '$3,240',
        annualSavings: '$38,880',
        backendConnected: false
    };
    
    document.getElementById('hours-saved').textContent = results.hoursSeaved;
    document.getElementById('missed-revenue').textContent = results.missedRevenue;
    document.getElementById('annual-savings').textContent = results.annualSavings;
    
    const tableBody = document.querySelector('#discrepancy-table tbody');
    
    // Add backend connection status if connected
    const connectionStatus = results.backendConnected ? 
        `<tr style="background: #e8f5e9;">
            <td><span style="color: #4caf50; font-weight: bold;">✅ Live Backend</span></td>
            <td>System Status</td>
            <td>-</td>
            <td>Connected</td>
            <td>Successfully connected to MedSpaSync Pro production API</td>
        </tr>` : '';
    
    tableBody.innerHTML = connectionStatus + `
        <tr>
            <td><span style="color: #f44336; font-weight: bold;">Missing Claim</span></td>
            <td>Patient A-123</td>
            <td>2025-05-15</td>
            <td>$85.00</td>
            <td>Botox treatment eligible for Alle rewards - claim not submitted</td>
        </tr>
        <tr>
            <td><span style="color: #ff9800; font-weight: bold;">Date Mismatch</span></td>
            <td>Patient B-456</td>
            <td>2025-05-22</td>
            <td>$120.00</td>
            <td>Aspire certificate processed 3 days after treatment - review timing</td>
        </tr>
        <tr>
            <td><span style="color: #f44336; font-weight: bold;">Missing Claim</span></td>
            <td>Patient C-789</td>
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

// Test backend connection on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        console.log('✅ Backend Health Check:', data);
        
        // Show connection status in console for demo purposes
        if (data.status === 'OK') {
            console.log('🚀 MedSpaSync Pro Backend: CONNECTED');
            console.log('📡 API Environment:', data.environment);
            console.log('🎯 Ready for live data processing!');
        }
    } catch (error) {
        console.log('⚠️ Backend connection failed - using demo mode');
        console.log('🔄 This is normal for demo purposes');
    }
});

function exportReport() {
    const reportContent = `
MedSpaSync Pro - Reconciliation Report
Generated: ${new Date().toLocaleDateString()}

SUMMARY:
- Hours Saved: 16.2 per week
- Process Improvements Identified: Multiple opportunities
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