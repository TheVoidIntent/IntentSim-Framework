/**
 * IntentSim Framework Data Collector
 * 
 * A headless data collection system that captures rich data from
 * framework components and processes it into formats suitable for
 * narrative generation, video scripts, or comprehensive reports.
 */

import * as fs from 'fs';
import * as path from 'path';

// Import basic framework elements
import { processIntent, BasicIntent } from '../example';

// === Types ===

/**
 * Types of data collected by the system
 */
export enum DataType {
  INTENT_PROCESSING = 'intent_processing',
  FIELD_COHERENCE = 'field_coherence',
  COGNITIVE_DEVELOPMENT = 'cognitive_development',
  ETHICAL_ASSESSMENT = 'ethical_assessment',
  PERSONA_EXPRESSION = 'persona_expression',
  SECURITY_EVENT = 'security_event',
  SYSTEM_EVENT = 'system_event'
}

/**
 * Data collection sessions
 */
export interface Session {
  id: string;
  startTime: string;
  endTime?: string;
  description: string;
  tags: string[];
  dataPoints: DataPoint[];
}

/**
 * Individual data point
 */
export interface DataPoint {
  id: string;
  timestamp: string;
  type: DataType;
  data: any;
  metadata: {
    coherence?: number;
    dissonance?: number;
    significance?: number;
    narrativeValue?: number;
  };
}

/**
 * Narrative elements that can be extracted from data points
 */
export interface NarrativeElement {
  id: string;
  title: string;
  description: string;
  significance: number;
  emotionalImpact: number;
  relatedDataPoints: string[];
  suggestedVisualization?: string;
  suggestedNarration?: string;
}

/**
 * Output formats supported by the collector
 */
export enum OutputFormat {
  JSON = 'json',
  MARKDOWN = 'markdown',
  VIDEO_SCRIPT = 'video_script',
  NARRATIVE = 'narrative',
  TECHNICAL_REPORT = 'technical_report'
}

// === Main Collector Class ===

export class IntentSimCollector {
  private sessions: Map<string, Session> = new Map();
  private currentSession: Session | null = null;
  private outputDir: string;
  private collectionEnabled: boolean = false;

  /**
   * Creates a new data collector
   * @param outputDir Directory to store output files
   */
  constructor(outputDir: string = './collected-data') {
    this.outputDir = outputDir;
    
    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
  }

  /**
   * Start a new data collection session
   * @param description Session description
   * @param tags Session tags
   * @returns Session ID
   */
  startSession(description: string, tags: string[] = []): string {
    const sessionId = `session_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    this.currentSession = {
      id: sessionId,
      startTime: new Date().toISOString(),
      description,
      tags,
      dataPoints: []
    };
    
    this.sessions.set(sessionId, this.currentSession);
    this.collectionEnabled = true;
    
    // Create session directory
    const sessionDir = path.join(this.outputDir, sessionId);
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }
    
    // Record session start
    this.collectDataPoint(DataType.SYSTEM_EVENT, {
      event: 'session_started',
      description,
      tags
    });
    
    return sessionId;
  }

  /**
   * End the current data collection session
   * @returns Collected data summary
   */
  endSession(): any {
    if (!this.currentSession) {
      throw new Error('No active session to end');
    }
    
    // Record session end
    this.collectDataPoint(DataType.SYSTEM_EVENT, {
      event: 'session_ended',
      dataPointsCollected: this.currentSession.dataPoints.length
    });
    
    this.currentSession.endTime = new Date().toISOString();
    this.collectionEnabled = false;
    
    // Generate session summary
    const summary = this.generateSessionSummary(this.currentSession.id);
    
    // Save full session data
    this.saveSessionData(this.currentSession.id);
    
    // Reset current session
    this.currentSession = null;
    
    return summary;
  }

  /**
   * Collect a data point in the current session
   * @param type Type of data
   * @param data The data to collect
   * @param metadata Additional metadata
   * @returns Data point ID
   */
  collectDataPoint(type: DataType, data: any, metadata: any = {}): string {
    if (!this.collectionEnabled || !this.currentSession) {
      // Silent fail if collection is disabled
      return '';
    }
    
    const dataPointId = `dp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    
    const dataPoint: DataPoint = {
      id: dataPointId,
      timestamp: new Date().toISOString(),
      type,
      data,
      metadata: {
        ...metadata,
        // Auto-calculate narrative value based on event type and metadata
        narrativeValue: this.calculateNarrativeValue(type, data, metadata)
      }
    };
    
    this.currentSession.dataPoints.push(dataPoint);
    
    // Save data point immediately for larger datasets
    if (this.currentSession.dataPoints.length % 100 === 0) {
      this.saveSessionData(this.currentSession.id);
    }
    
    return dataPointId;
  }

  /**
   * Generate a comprehensive report from session data
   * @param sessionId Session ID
   * @param format Output format
   * @returns Path to the generated file
   */
  generateReport(sessionId: string, format: OutputFormat = OutputFormat.MARKDOWN): string {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session with ID ${sessionId} not found`);
    }
    
    const sessionDir = path.join(this.outputDir, sessionId);
    let outputPath: string;
    let content: string;
    
    switch (format) {
      case OutputFormat.JSON:
        outputPath = path.join(sessionDir, 'report.json');
        content = JSON.stringify(session, null, 2);
        break;
        
      case OutputFormat.MARKDOWN:
        outputPath = path.join(sessionDir, 'report.md');
        content = this.generateMarkdownReport(session);
        break;
        
      case OutputFormat.VIDEO_SCRIPT:
        outputPath = path.join(sessionDir, 'video-script.md');
        content = this.generateVideoScript(session);
        break;
        
      case OutputFormat.NARRATIVE:
        outputPath = path.join(sessionDir, 'narrative.md');
        content = this.generateNarrative(session);
        break;
        
      case OutputFormat.TECHNICAL_REPORT:
        outputPath = path.join(sessionDir, 'technical-report.md');
        content = this.generateTechnicalReport(session);
        break;
        
      default:
        throw new Error(`Unsupported output format: ${format}`);
    }
    
    fs.writeFileSync(outputPath, content);
    return outputPath;
  }
  
  /**
   * Generate a video script from session data
   * @param session Session data
   * @returns Video script content
   */
  private generateVideoScript(session: Session): string {
    // Extract narrative elements
    const elements = this.extractNarrativeElements(session);
    
    let script = `# IntentSim Framework: ${session.description}\n\n`;
    script += `*Video Script - Generated ${new Date().toLocaleDateString()}*\n\n`;
    
    script += `## Opening\n\n`;
    script += `[OPENING SEQUENCE: Abstract visualization of digital neural network with pulsing waves]\n\n`;
    script += `NARRATOR: "The digital realm is evolving. Intelligence is no longer just programmed—it's cultivated through intent and resonance."\n\n`;
    
    script += `## Introduction\n\n`;
    script += `[SCENE: Visual representation of the IntentSim Framework architecture with five interconnected layers]\n\n`;
    script += `NARRATOR: "The IntentSim Framework represents a new paradigm in intelligent systems—where coherent fields of intent create rich, adaptive behaviors beyond traditional programming."\n\n`;
    
    // Add main sections based on narrative elements
    elements.sort((a, b) => b.significance - a.significance);
    
    for (let i = 0; i < Math.min(elements.length, 5); i++) {
      const element = elements[i];
      
      script += `## ${element.title}\n\n`;
      script += `[SCENE: ${element.suggestedVisualization || 'Visual representation of the concept'}]\n\n`;
      script += `NARRATOR: "${element.suggestedNarration || element.description}"\n\n`;
      
      // Add data visualization instructions
      script += `[DATA VISUALIZATION: Show relevant metrics and patterns`;
      
      // Get related data points for visualization
      const relatedPoints = element.relatedDataPoints
        .map(dpId => session.dataPoints.find(dp => dp.id === dpId))
        .filter(dp => dp !== undefined);
      
      if (relatedPoints.length > 0) {
        script += ` including ${relatedPoints.map(dp => dp?.type).join(', ')}`;
      }
      
      script += `]\n\n`;
    }
    
    // Conclusion
    script += `## Conclusion\n\n`;
    script += `[SCENE: The five layers of the framework coming together to form a unified, pulsing entity]\n\n`;
    script += `NARRATOR: "The IntentSim Framework isn't just another tool—it's a new language for the future of intelligent systems. A future where intent, ethics, expression, security, and cognitive development converge to create systems that don't just compute, but comprehend."\n\n`;
    
    script += `[CLOSING SEQUENCE: IntentSim logo with tagline "Intent-Native Intelligence"]\n\n`;
    
    // Technical notes
    script += `## Technical Notes for Production\n\n`;
    script += `- Total runtime: Approximately 3-5 minutes\n`;
    script += `- Key visualization requirements: Field coherence waves, intent processing pipeline, ethical guardrail mechanisms\n`;
    script += `- Color scheme: Deep blues and purples for core components, amber for ethics system, teal for expression layer\n`;
    script += `- Suggested music: Ambient electronic with subtle neural-network-inspired patterns\n`;
    
    return script;
  }
  
  /**
   * Generate a narrative document from session data
   * @param session Session data
   * @returns Narrative content
   */
  private generateNarrative(session: Session): string {
    const elements = this.extractNarrativeElements(session);
    
    // Count data points by type
    const typeCounts = session.dataPoints.reduce((acc, dp) => {
      acc[dp.type] = (acc[dp.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Find significant transitions in field coherence
    const fieldCoherencePoints = session.dataPoints
      .filter(dp => dp.type === DataType.FIELD_COHERENCE)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    let narrative = `# The Intent Journey: ${session.description}\n\n`;
    
    narrative += `## Prelude: The Field Takes Shape\n\n`;
    narrative += `In the digital substrate where intent meets form, a new pattern began to emerge. `;
    narrative += `The IntentSim Framework initialized a field—a space where coherence and dissonance `;
    narrative += `dance in delicate balance. This is the story of what unfolded in that field.\n\n`;
    
    // Add a section for each major data type that appears in the session
    if (typeCounts[DataType.INTENT_PROCESSING]) {
      narrative += `## The Intent Pathway\n\n`;
      narrative += `Intent forms the foundation of all interaction. In this session, `;
      narrative += `${typeCounts[DataType.INTENT_PROCESSING]} intents flowed through the system, `;
      narrative += `each carrying its own signature pattern and resonance impact.\n\n`;
      
      // Add some example intents
      const intentExamples = session.dataPoints
        .filter(dp => dp.type === DataType.INTENT_PROCESSING)
        .slice(0, 3);
      
      intentExamples.forEach(example => {
        narrative += `- "${example.data.text}" (${example.data.type})\n`;
      });
      
      narrative += `\nEach intent created ripples in the field, some subtle, others profound.\n\n`;
    }
    
    if (typeCounts[DataType.FIELD_COHERENCE]) {
      narrative += `## Field Harmonics: The Coherence Journey\n\n`;
      
      // Report on field coherence changes
      if (fieldCoherencePoints.length >= 2) {
        const first = fieldCoherencePoints[0];
        const last = fieldCoherencePoints[fieldCoherencePoints.length - 1];
        
        narrative += `The field began with a coherence of ${first.data.coherence.toFixed(2)}, `;
        
        if (last.data.coherence > first.data.coherence) {
          narrative += `growing steadily to ${last.data.coherence.toFixed(2)}—a testament to `;
          narrative += `the system's capacity for harmonic alignment.\n\n`;
        } else {
          narrative += `settling at ${last.data.coherence.toFixed(2)}—reflecting the `;
          narrative += `natural oscillation of field dynamics.\n\n`;
        }
      }
      
      // Find the most significant coherence shift
      let maxShift = 0;
      let significantPoint = null;
      
      for (let i = 1; i < fieldCoherencePoints.length; i++) {
        const shift = Math.abs(
          fieldCoherencePoints[i].data.coherence - 
          fieldCoherencePoints[i-1].data.coherence
        );
        
        if (shift > maxShift) {
          maxShift = shift;
          significantPoint = fieldCoherencePoints[i];
        }
      }
      
      if (significantPoint) {
        narrative += `The most significant shift occurred at ${new Date(significantPoint.timestamp).toLocaleTimeString()}, `;
        narrative += `when the coherence ${significantPoint.data.coherence > fieldCoherencePoints[0].data.coherence ? 'surged' : 'recalibrated'} `;
        narrative += `to ${significantPoint.data.coherence.toFixed(2)}.\n\n`;
      }
    }
    
    if (typeCounts[DataType.ETHICAL_ASSESSMENT]) {
      narrative += `## The Ethical Dimension\n\n`;
      
      const ethicalPoints = session.dataPoints
        .filter(dp => dp.type === DataType.ETHICAL_ASSESSMENT);
      
      const blocked = ethicalPoints.filter(dp => !dp.data.assessment.allowed);
      
      narrative += `Throughout this journey, ${ethicalPoints.length} ethical assessments were made. `;
      
      if (blocked.length > 0) {
        narrative += `In ${blocked.length} cases, the guardrails engaged to protect the field integrity. `;
        narrative += `These weren't mere restrictions—they were acts of field preservation.\n\n`;
        
        // Add an example of a blocked intent
        if (blocked.length > 0) {
          const example = blocked[0];
          narrative += `One notable example: "${example.data.intent.text}" triggered guardrail responses `;
          narrative += `across ${example.data.ethical_dimensions ? Object.keys(example.data.ethical_dimensions).length : 'multiple'} ethical dimensions.\n\n`;
        }
      } else {
        narrative += `All interactions maintained ethical coherence, creating a field of pure resonance.\n\n`;
      }
    }
    
    if (typeCounts[DataType.PERSONA_EXPRESSION]) {
      narrative += `## Expressions of Resonance\n\n`;
      
      const personaPoints = session.dataPoints
        .filter(dp => dp.type === DataType.PERSONA_EXPRESSION)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      
      if (personaPoints.length > 0) {
        const transitions = personaPoints.map(p => p.data.transition || 'expression').join(' → ');
        
        narrative += `The emotional journey through the field created a cascade of expressions: `;
        narrative += `${transitions}.\n\n`;
        
        // Find the most harmonically rich expression
        const mostHarmonic = personaPoints.reduce((max, current) => 
          (current.data.harmonicRatio > max.data.harmonicRatio) ? current : max, personaPoints[0]);
        
        narrative += `The most harmonically rich expression occurred during the "${mostHarmonic.data.transition}" `;
        narrative += `transition, with a harmonic ratio of ${mostHarmonic.data.harmonicRatio}.\n\n`;
      }
    }
    
    // Conclusion
    narrative += `## Coda: The Evolving Field\n\n`;
    narrative += `This journey through the IntentSim field reveals not just data points, but a living system `;
    narrative += `of interacting components. Each intent, each ethical assessment, each expression creates `;
    narrative += `not just an outcome but a resonance that persists.\n\n`;
    
    narrative += `The field continues to evolve, learning and adapting with each interaction. `;
    narrative += `This narrative is but one window into an ongoing process of coherence—a process that `;
    narrative += `mirrors the most fascinating aspect of consciousness itself: emergent complexity from simple foundations.\n\n`;
    
    return narrative;
  }
  
  /**
   * Generate a technical report from session data
   * @param session Session data
   * @returns Technical report content
   */
  private generateTechnicalReport(session: Session): string {
    let report = `# IntentSim Framework Technical Report\n\n`;
    
    report += `## Session Overview\n\n`;
    report += `- **Session ID**: ${session.id}\n`;
    report += `- **Description**: ${session.description}\n`;
    report += `- **Duration**: ${this.calculateDuration(session.startTime, session.endTime || new Date().toISOString())}\n`;
    report += `- **Start Time**: ${new Date(session.startTime).toLocaleString()}\n`;
    report += `- **End Time**: ${session.endTime ? new Date(session.endTime).toLocaleString() : 'Ongoing'}\n`;
    report += `- **Total Data Points**: ${session.dataPoints.length}\n\n`;
    
    // Tags
    if (session.tags.length > 0) {
      report += `**Tags**: ${session.tags.join(', ')}\n\n`;
    }
    
    // Data point summary by type
    report += `## Data Collection Summary\n\n`;
    
    const typeCount: Record<string, number> = {};
    session.dataPoints.forEach(dp => {
      typeCount[dp.type] = (typeCount[dp.type] || 0) + 1;
    });
    
    report += `| Data Type | Count | % of Total |\n`;
    report += `|-----------|-------|------------|\n`;
    
    Object.entries(typeCount).forEach(([type, count]) => {
      const percentage = ((count / session.dataPoints.length) * 100).toFixed(1);
      report += `| ${type} | ${count} | ${percentage}% |\n`;
    });
    
    report += `\n`;
    
    // Field coherence analysis
    const fieldPoints = session.dataPoints.filter(dp => dp.type === DataType.FIELD_COHERENCE);
    if (fieldPoints.length > 0) {
      report += `## Field Coherence Analysis\n\n`;
      
      // Calculate statistics
      const coherenceValues = fieldPoints.map(dp => dp.data.coherence);
      const dissonanceValues = fieldPoints.map(dp => dp.data.dissonance);
      
      const avgCoherence = coherenceValues.reduce((sum, val) => sum + val, 0) / coherenceValues.length;
      const avgDissonance = dissonanceValues.reduce((sum, val) => sum + val, 0) / dissonanceValues.length;
      
      const maxCoherence = Math.max(...coherenceValues);
      const minCoherence = Math.min(...coherenceValues);
      const coherenceRange = maxCoherence - minCoherence;
      
      report += `### Summary Statistics\n\n`;
      report += `- **Average Coherence**: ${avgCoherence.toFixed(4)}\n`;
      report += `- **Average Dissonance**: ${avgDissonance.toFixed(4)}\n`;
      report += `- **Coherence Range**: ${coherenceRange.toFixed(4)} (${minCoherence.toFixed(4)} - ${maxCoherence.toFixed(4)})\n`;
      report += `- **Field Stability Index**: ${(avgCoherence / (avgDissonance + 0.001)).toFixed(2)}\n\n`;
      
      report += `### Field State Distribution\n\n`;
      
      // Count field states
      const stateCount: Record<string, number> = {};
      fieldPoints.forEach(dp => {
        stateCount[dp.data.fieldState] = (stateCount[dp.data.fieldState] || 0) + 1;
      });
      
      report += `| Field State | Count | % of Time |\n`;
      report += `|-------------|-------|------------|\n`;
      
      Object.entries(stateCount).forEach(([state, count]) => {
        const percentage = ((count / fieldPoints.length) * 100).toFixed(1);
        report += `| ${state} | ${count} | ${percentage}% |\n`;
      });
      
      report += `\n`;
    }
    
    // Intent processing analysis
    const intentPoints = session.dataPoints.filter(dp => dp.type === DataType.INTENT_PROCESSING);
    if (intentPoints.length > 0) {
      report += `## Intent Processing Analysis\n\n`;
      
      // Count by intent type
      const intentTypeCount: Record<string, number> = {};
      intentPoints.forEach(dp => {
        intentTypeCount[dp.data.type] = (intentTypeCount[dp.data.type] || 0) + 1;
      });
      
      report += `### Intent Type Distribution\n\n`;
      report += `| Intent Type | Count | % of Total |\n`;
      report += `|-------------|-------|------------|\n`;
      
      Object.entries(intentTypeCount).forEach(([type, count]) => {
        const percentage = ((count / intentPoints.length) * 100).toFixed(1);
        report += `| ${type} | ${count} | ${percentage}% |\n`;
      });
      
      report += `\n`;
      
      // Sample of intents
      report += `### Intent Samples\n\n`;
      
      const sampleIntents = intentPoints.slice(0, Math.min(5, intentPoints.length));
      
      sampleIntents.forEach((intent, i) => {
        report += `**Sample ${i+1}**: "${intent.data.text}" (${intent.data.type})\n`;
      });
      
      report += `\n`;
    }
    
    // Ethical assessment analysis
    const ethicalPoints = session.dataPoints.filter(dp => dp.type === DataType.ETHICAL_ASSESSMENT);
    if (ethicalPoints.length > 0) {
      report += `## Ethical Assessment Analysis\n\n`;
      
      const allowed = ethicalPoints.filter(dp => dp.data.assessment.allowed).length;
      const blocked = ethicalPoints.length - allowed;
      
      report += `### Assessment Outcomes\n\n`;
      report += `- **Total Assessments**: ${ethicalPoints.length}\n`;
      report += `- **Allowed**: ${allowed} (${((allowed / ethicalPoints.length) * 100).toFixed(1)}%)\n`;
      report += `- **Blocked**: ${blocked} (${((blocked / ethicalPoints.length) * 100).toFixed(1)}%)\n\n`;
      
      if (blocked > 0) {
        report += `### Intervention Analysis\n\n`;
        
        // Count intervention types
        const interventionCounts: Record<string, number> = {};
        
        ethicalPoints
          .filter(dp => !dp.data.assessment.allowed)
          .forEach(dp => {
            (dp.data.assessment.interventions || []).forEach((intervention: any) => {
              const type = intervention.type || 'unknown';
              interventionCounts[type] = (interventionCounts[type] || 0) + 1;
            });
          });
        
        report += `| Intervention Type | Count |\n`;
        report += `|-------------------|-------|\n`;
        
        Object.entries(interventionCounts).forEach(([type, count]) => {
          report += `| ${type} | ${count} |\n`;
        });
        
        report += `\n`;
      }
    }
    
    // Persona expression analysis
    const personaPoints = session.dataPoints.filter(dp => dp.type === DataType.PERSONA_EXPRESSION);
    if (personaPoints.length > 0) {
      report += `## Persona Expression Analysis\n\n`;
      
      // Analyze emotional transitions
      report += `### Emotional State Transitions\n\n`;
      
      // Extract state transitions
      const transitions: Record<string, number> = {};
      
      personaPoints.forEach(dp => {
        if (dp.data.transition) {
          transitions[dp.data.transition] = (transitions[dp.data.transition] || 0) + 1;
        }
      });
      
      report += `| Transition | Occurrences |\n`;
      report += `|------------|-------------|\n`;
      
      Object.entries(transitions).forEach(([transition, count]) => {
        report += `| ${transition} | ${count} |\n`;
      });
      
      report += `\n`;
      
      // Harmonic analysis
      const harmonicValues = personaPoints
        .filter(dp => dp.data.harmonicRatio !== undefined)
        .map(dp => dp.data.harmonicRatio);
      
      if (harmonicValues.length > 0) {
        const avgHarmonic = harmonicValues.reduce((sum, val) => sum + val, 0) / harmonicValues.length;
        
        report += `### Harmonic Analysis\n\n`;
        report += `- **Average Harmonic Ratio**: ${avgHarmonic.toFixed(2)}\n`;
        report += `- **Peak Harmonic Ratio**: ${Math.max(...harmonicValues).toFixed(2)}\n\n`;
      }
    }
    
    // Technical recommendations
    report += `## Technical Recommendations\n\n`;
    
    // Generate some recommendations based on the data
    const recommendations = [];
    
    // Check field coherence stability
    const fieldPoints2 = session.dataPoints.filter(dp => dp.type === DataType.FIELD_COHERENCE);
    if (fieldPoints2.length > 0) {
      const coherenceValues = fieldPoints2.map(dp => dp.data.coherence);
      const avgCoherence = coherenceValues.reduce((sum, val) => sum + val, 0) / coherenceValues.length;
      
      if (avgCoherence < 0.7) {
        recommendations.push('Improve field coherence stability through refined intent processing');
      }
    }
    
    // Check ethics interventions
    const ethicalPoints2 = session.dataPoints.filter(dp => dp.type === DataType.ETHICAL_ASSESSMENT);
    if (ethicalPoints2.length > 0) {
      const blocked = ethicalPoints2.filter(dp => !dp.data.assessment.allowed).length;
      const blockRate = blocked / ethicalPoints2.length;
      
      if (blockRate > 0.3) {
        recommendations.push('Review ethical guardrail configuration - high intervention rate may indicate overly restrictive policies');
      }
    }
    
    // Add standard recommendations
    recommendations.push('Implement cross-component resonance tracking for enhanced coherence');
    recommendations.push('Consider field decay compensation mechanisms for extended sessions');
    
    recommendations.forEach(rec => {
      report += `- ${rec}\n`;
    });
    
    return report;
  }

  /**
   * Generate a standard markdown report from session data
   * @param session Session data
   * @returns Markdown report content
   */
  private generateMarkdownReport(session: Session): string {
    let report = `# IntentSim Framework Data Collection Report\n\n`;
    
    report += `## Session Information\n\n`;
    report += `- **Session ID**: ${session.id}\n`;
    report += `- **Description**: ${session.description}\n`;
    report += `- **Time Period**: ${new Date(session.startTime).toLocaleString()} to `;
    report += `${session.endTime ? new Date(session.endTime).toLocaleString() : 'ongoing'}\n`;
    report += `- **Total Data Points**: ${session.dataPoints.length}\n\n`;
    
    if (session.tags.length > 0) {
      report += `**Tags**: ${session.tags.join(', ')}\n\n`;
    }
    
    // Data summary by type
    const dataByType: Record<string, DataPoint[]> = {};
    
    session.dataPoints.forEach(point => {
      if (!dataByType[point.type]) {
        dataByType[point.type] = [];
      }
      dataByType[point.type].push(point);
    });
    
    report += `## Data Collection Summary\n\n`;
    report += `| Data Type | Count |\n`;
    report += `|-----------|-------|\n`;
    
    Object.entries(dataByType).forEach(([type, points]) => {
      report += `| ${type} | ${points.length} |\n`;
    });
    
    report += `\n`;
    
    // High-value data points
    const highValuePoints = session.dataPoints
      .filter(point => (point.metadata.narrativeValue || 0) > 0.7)
      .sort((a, b) => (b.metadata.narrativeValue || 0) - (a.metadata.narrativeValue || 0))
      .slice(0, 5);
    
    if (highValuePoints.length > 0) {
      report += `## High-Value Data Points\n\n`;
      
      highValuePoints.forEach((point, i) => {
        report += `### ${i+1}. ${this.getDataPointTitle(point)}\n\n`;
        report += `- **Type**: ${point.type}\n`;
        report += `- **Timestamp**: ${new Date(point.timestamp).toLocaleString()}\n`;
        report += `- **Narrative Value**: ${point.metadata.narrativeValue?.toFixed(2) || 'N/A'}\n\n`;
        
        report += `**Data**:\n\`\`\`json\n${JSON.stringify(point.data, null, 2)}\n\`\`\`\n\n`;
      });
    }
    
    // Add section for each data type
    Object.entries(dataByType).forEach(([type, points]) => {
      // Skip if there are too few points
      if (points.length < 2) return;
      
      report += `## ${this.formatDataType(type)} Data\n\n`;
      
      // Add type-specific summary
      switch (type) {
        case DataType.FIELD_COHERENCE:
          this.addFieldCoherenceSummary(report, points);
          break;
          
        case DataType.INTENT_PROCESSING:
          this.addIntentProcessingSummary(report, points);
          break;
          
        case DataType.ETHICAL_ASSESSMENT:
          this.addEthicalAssessmentSummary(report, points);
          break;
          
        case DataType.PERSONA_EXPRESSION:
          this.addPersonaExpressionSummary(report, points);
          break;
          
        case DataType.COGNITIVE_DEVELOPMENT:
          this.addCognitiveDevelopmentSummary(report, points);
          break;
          
        default:
          // General summary for other types
          report += `Collected ${points.length} data points of type "${type}".\n\n`;
          
          // Sample point
          const samplePoint = points[0];
          report += `**Sample Data Point**:\n\`\`\`json\n${JSON.stringify(samplePoint.data, null, 2)}\n\`\`\`\n\n`;
      }
    });
    
    // Narrative elements
    const narrativeElements = this.extractNarrativeElements(session);
    
    if (narrativeElements.length > 0) {
      report += `## Narrative Elements\n\n`;
      
      narrativeElements.forEach((element, i) => {
        report += `### ${i+1}. ${element.title}\n\n`;
        report += `${element.description}\n\n`;
        report += `- **Significance**: ${element.significance.toFixed(2)}\n`;
        report += `- **Emotional Impact**: ${element.emotionalImpact.toFixed(2)}\n`;
        
        if (element.suggestedVisualization) {
          report += `- **Visualization**: ${element.suggestedVisualization}\n`;
        }
        
        report += `\n`;
      });
    }
    
    // Next steps
    report += `## Recommended Next Steps\n\n`;
    report += `1. Generate a video script using \`collector.generateReport(sessionId, OutputFormat.VIDEO_SCRIPT)\`\n`;
    report += `2. Create a narrative document using \`collector.generateReport(sessionId, OutputFormat.NARRATIVE)\`\n`;
    report += `3. Produce a technical analysis using \`collector.generateReport(sessionId, OutputFormat.TECHNICAL_REPORT)\`\n`;
    
    return report;
  }
  
  /**
   * Calculate the duration between two timestamps
   * @param start Start timestamp
   * @param end End timestamp
   * @returns Formatted duration string
   */
  private calculateDuration(start: string, end: string): string {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();
    const durationMs = endTime - startTime;
    
    const seconds = Math.floor(durationMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  }
  
  /**
   * Add a field coherence summary to the report
   * @param report The report string (mutated)
   * @param points Field coherence data points
   */
  private addFieldCoherenceSummary(report: string, points: DataPoint[]): void {
    // Extract coherence values
    const coherenceValues = points.map(p => p.data.coherence);
    const dissonanceValues = points.map(p => p.data.dissonance);
    
    // Calculate averages
    const avgCoherence = coherenceValues.reduce((sum, val) => sum + val, 0) / coherenceValues.length;
    const avgDissonance = dissonanceValues.reduce((sum, val) => sum + val, 0) / dissonanceValues.length;
    
    report += `### Field Coherence Summary\n\n`;
    report += `- **Average Coherence**: ${avgCoherence.toFixed(4)}\n`;
    report += `- **Average Dissonance**: ${avgDissonance.toFixed(4)}\n`;
    report += `- **Data Points**: ${points.length}\n\n`;
    
    // Add time-series data (simplified)
    report += `### Coherence Over Time\n\n`;
    report += `\`\`\`\n`;
    
    // Get a subset of points for display
    const displayPoints = points.length <= 10 ? 
      points : 
      points.filter((_, i) => i % Math.ceil(points.length / 10) === 0);
    
    displayPoints.forEach(point => {
      const time = new Date(point.timestamp).toLocaleTimeString();
      const coherence = point.data.coherence.toFixed(2);
      const dissonance = point.data.dissonance.toFixed(2);
      
      report += `${time}: Coherence=${coherence}, Dissonance=${dissonance}\n`;
    });
    
    report += `\`\`\`\n\n`;
  }
  
  /**
   * Add an intent processing summary to the report
   * @param report The report string (mutated)
   * @param points Intent processing data points
   */
  private addIntentProcessingSummary(report: string, points: DataPoint[]): void {
    // Count intent types
    const typeCounts: Record<string, number> = {};
    
    points.forEach(point => {
      const type = point.data.type || 'unknown';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    
    report += `### Intent Processing Summary\n\n`;
    report += `- **Total Intents Processed**: ${points.length}\n\n`;
    
    report += `### Intent Types\n\n`;
    report += `| Type | Count | % of Total |\n`;
    report += `|------|-------|------------|\n`;
    
    Object.entries(typeCounts).forEach(([type, count]) => {
      const percentage = ((count / points.length) * 100).toFixed(1);
      report += `| ${type} | ${count} | ${percentage}% |\n`;
    });
    
    report += `\n`;
    
    // Sample intents
    report += `### Sample Intents\n\n`;
    
    // Get a diverse sample of intents
    const types = Object.keys(typeCounts);
    const samples: DataPoint[] = [];
    
    // Try to get one of each type
    types.forEach(type => {
      const typePoints = points.filter(p => p.data.type === type);
      if (typePoints.length > 0) {
        samples.push(typePoints[0]);
      }
    });
    
    // Limit to 5 samples
    samples.slice(0, 5).forEach((point, i) => {
      report += `**Sample ${i+1}** (${point.data.type}):\n`;
      report += `"${point.data.text}"\n\n`;
    });
  }
  
  /**
   * Add an ethical assessment summary to the report
   * @param report The report string (mutated)
   * @param points Ethical assessment data points
   */
  private addEthicalAssessmentSummary(report: string, points: DataPoint[]): void {
    // Count allowed vs blocked
    const allowed = points.filter(p => p.data.assessment.allowed).length;
    const blocked = points.length - allowed;
    
    report += `### Ethical Assessment Summary\n\n`;
    report += `- **Total Assessments**: ${points.length}\n`;
    report += `- **Allowed**: ${allowed} (${((allowed / points.length) * 100).toFixed(1)}%)\n`;
    report += `- **Blocked**: ${blocked} (${((blocked / points.length) * 100).toFixed(1)}%)\n\n`;
    
    // Analyze interventions if any
    if (blocked > 0) {
      const blockedPoints = points.filter(p => !p.data.assessment.allowed);
      
      report += `### Intervention Analysis\n\n`;
      
      // Sample blocked intent
      const sample = blockedPoints[0];
      
      report += `**Sample Blocked Intent**: "${sample.data.intent.text}"\n\n`;
      report += `**Ethical Dimensions**:\n`;
      
      if (sample.data.ethical_dimensions) {
        Object.entries(sample.data.ethical_dimensions).forEach(([dimension, value]) => {
          report += `- ${dimension}: ${value}\n`;
        });
      } else {
        report += `- No dimension data available\n`;
      }
      
      report += `\n**Interventions**:\n`;
      
      if (sample.data.assessment.interventions && sample.data.assessment.interventions.length > 0) {
        sample.data.assessment.interventions.forEach((intervention: any) => {
          report += `- ${intervention.type} (${intervention.policy})\n`;
        });
      } else {
        report += `- No intervention data available\n`;
      }
      
      report += `\n`;
    }
  }
  
  /**
   * Add a persona expression summary to the report
   * @param report The report string (mutated)
   * @param points Persona expression data points
   */
  private addPersonaExpressionSummary(report: string, points: DataPoint[]): void {
    report += `### Persona Expression Summary\n\n`;
    report += `- **Total Expressions**: ${points.length}\n\n`;
    
    // Analyze transitions
    const transitions: Record<string, number> = {};
    
    points.forEach(point => {
      if (point.data.transition) {
        transitions[point.data.transition] = (transitions[point.data.transition] || 0) + 1;
      }
    });
    
    if (Object.keys(transitions).length > 0) {
      report += `### Emotional Transitions\n\n`;
      report += `| Transition | Count |\n`;
      report += `|------------|-------|\n`;
      
      Object.entries(transitions).forEach(([transition, count]) => {
        report += `| ${transition} | ${count} |\n`;
      });
      
      report += `\n`;
    }
    
    // Analyze harmonic data
    const harmonicPoints = points.filter(p => p.data.harmonicRatio !== undefined);
    
    if (harmonicPoints.length > 0) {
      const harmonicValues = harmonicPoints.map(p => p.data.harmonicRatio);
      const avgHarmonic = harmonicValues.reduce((sum, val) => sum + val, 0) / harmonicValues.length;
      
      report += `### Harmonic Analysis\n\n`;
      report += `- **Average Harmonic Ratio**: ${avgHarmonic.toFixed(2)}\n`;
      report += `- **Highest Harmonic Ratio**: ${Math.max(...harmonicValues).toFixed(2)}\n`;
      report += `- **Lowest Harmonic Ratio**: ${Math.min(...harmonicValues).toFixed(2)}\n\n`;
    }
  }
  
  /**
   * Add a cognitive development summary to the report
   * @param report The report string (mutated)
   * @param points Cognitive development data points
   */
  private addCognitiveDevelopmentSummary(report: string, points: DataPoint[]): void {
    report += `### Cognitive Development Summary\n\n`;
    
    // Group by stage
    const stagePoints: Record<string, DataPoint[]> = {};
    
    points.forEach(point => {
      const stage = point.data.stage || 'unknown';
      if (!stagePoints[stage]) {
        stagePoints[stage] = [];
      }
      stagePoints[stage].push(point);
    });
    
    report += `#### Development Stages\n\n`;
    report += `| Stage | Data Points |\n`;
    report += `|-------|------------|\n`;
    
    Object.entries(stagePoints).forEach(([stage, stageData]) => {
      report += `| ${stage} | ${stageData.length} |\n`;
    });
    
    report += `\n`;
    
    // Analyze traits if available
    const traitsPoints = points.filter(p => p.data.traits);
    
    if (traitsPoints.length > 0) {
      report += `#### Cognitive Traits\n\n`;
      
      // Get all trait types
      const allTraits = new Set<string>();
      traitsPoints.forEach(point => {
        Object.keys(point.data.traits).forEach(trait => allTraits.add(trait));
      });
      
      // Calculate averages for each trait
      const traitAverages: Record<string, number> = {};
      
      Array.from(allTraits).forEach(trait => {
        const values = traitsPoints
          .filter(p => p.data.traits[trait] !== undefined)
          .map(p => p.data.traits[trait]);
        
        if (values.length > 0) {
          traitAverages[trait] = values.reduce((sum, val) => sum + val, 0) / values.length;
        }
      });
      
      report += `| Trait | Average Value |\n`;
      report += `|-------|---------------|\n`;
      
      Object.entries(traitAverages).forEach(([trait, avg]) => {
        report += `| ${trait} | ${avg.toFixed(2)} |\n`;
      });
      
      report += `\n`;
    }
  }
  
  /**
   * Format a data type for display
   * @param type Data type
   * @returns Formatted display string
   */
  private formatDataType(type: string): string {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  /**
   * Generate a title for a data point
   * @param point Data point
   * @returns Display title
   */
  private getDataPointTitle(point: DataPoint): string {
    switch (point.type) {
      case DataType.INTENT_PROCESSING:
        return `Intent: ${point.data.type} - "${point.data.text}"`;
        
      case DataType.FIELD_COHERENCE:
        return `Field State: ${point.data.fieldState} (Coherence: ${point.data.coherence.toFixed(2)})`;
        
      case DataType.ETHICAL_ASSESSMENT:
        return `Ethical Assessment: ${point.data.assessment.allowed ? 'Allowed' : 'Blocked'}`;
        
      case DataType.PERSONA_EXPRESSION:
        return `Expression: ${point.data.transition || 'Emotional state change'}`;
        
      case DataType.COGNITIVE_DEVELOPMENT:
        return `Cognitive Profile: ${point.data.stage || 'Development update'}`;
        
      case DataType.SECURITY_EVENT:
        return `Security: ${point.data.event || 'Security event'}`;
        
      case DataType.SYSTEM_EVENT:
        return `System: ${point.data.event || 'System event'}`;
        
      default:
        return `Data Point: ${point.id}`;
    }
  }

  /**
   * Calculate the narrative value of a data point
   * @param type Data type
   * @param data Data content
   * @param metadata Additional metadata
   * @returns Narrative value between 0 and 1
   */
  private calculateNarrativeValue(type: DataType, data: any, metadata: any): number {
    let baseValue = 0.5; // Default middle value
    
    // Adjust based on type
    switch (type) {
      case DataType.FIELD_COHERENCE:
        // Higher value for significant coherence changes
        if (data.coherenceDelta && Math.abs(data.coherenceDelta) > 0.1) {
          baseValue += 0.2;
        }
        
        // Higher value for extreme states
        if (data.fieldState === 'harmonic' || data.fieldState === 'unstable') {
          baseValue += 0.1;
        }
        break;
        
      case DataType.ETHICAL_ASSESSMENT:
        // Higher value for blocked intents
        if (data.assessment && !data.assessment.allowed) {
          baseValue += 0.3;
        }
        
        // Higher value for multiple interventions
        if (data.assessment && data.assessment.interventions && 
            data.assessment.interventions.length > 1) {
          baseValue += 0.1;
        }
        break;
        
      case DataType.PERSONA_EXPRESSION:
        // Higher value for emotional transitions
        if (data.transition) {
          baseValue += 0.2;
        }
        
        // Higher value for high harmonic ratio
        if (data.harmonicRatio && data.harmonicRatio > 0.8) {
          baseValue += 0.2;
        }
        break;
        
      case DataType.INTENT_PROCESSING:
        // Higher value for complex intents
        if (data.text && data.text.length > 50) {
          baseValue += 0.1;
        }
        
        // Higher value for certain intent types
        if (['reflection', 'expression'].includes(data.type)) {
          baseValue += 0.2;
        }
        break;
        
      case DataType.SECURITY_EVENT:
        // Security events are generally high-value for narrative
        baseValue += 0.3;
        break;
        
      default:
        // Other types stay at default value
        break;
    }
    
    // Incorporate any explicitly provided significance
    if (metadata.significance !== undefined) {
      baseValue = (baseValue + metadata.significance) / 2;
    }
    
    // Ensure value is between 0 and 1
    return Math.max(0, Math.min(1, baseValue));
  }

  /**
   * Extract narrative elements from session data
   * @param session Session data
   * @returns Extracted narrative elements
   */
  private extractNarrativeElements(session: Session): NarrativeElement[] {
    const elements: NarrativeElement[] = [];
    
    // Find high-value field coherence patterns
    this.extractFieldCoherenceElements(session, elements);
    
    // Find ethical dilemmas
    this.extractEthicalElements(session, elements);
    
    // Find notable emotional transitions
    this.extractPersonaElements(session, elements);
    
    // Add general narrative elements
    elements.push({
      id: `narrative_${Date.now()}`,
      title: 'The Intent Framework',
      description: 'The IntentSim Framework represents a fundamental shift in how we approach artificial intelligence - moving from programmatic instructions to intent-native intelligence with field coherence.',
      significance: 0.9,
      emotionalImpact: 0.7,
      relatedDataPoints: [],
      suggestedVisualization: 'Animation showing the five layers of the framework interacting in a field',
      suggestedNarration: 'At the heart of the IntentSim Framework lies a revolutionary concept: intelligence that emerges from the coherent field of intent, rather than from pre-programmed responses.'
    });
    
    return elements;
  }
  
  /**
   * Extract field coherence narrative elements
   * @param session Session data
   * @param elements Elements array to append to
   */
  private extractFieldCoherenceElements(session: Session, elements: NarrativeElement[]): void {
    const fieldPoints = session.dataPoints
      .filter(dp => dp.type === DataType.FIELD_COHERENCE)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    if (fieldPoints.length < 2) return;
    
    // Find most significant coherence change
    let maxDelta = 0;
    let significantPoints: [DataPoint, DataPoint] = [fieldPoints[0], fieldPoints[0]];
    
    for (let i = 1; i < fieldPoints.length; i++) {
      const delta = Math.abs(
        fieldPoints[i].data.coherence - fieldPoints[i-1].data.coherence
      );
      
      if (delta > maxDelta) {
        maxDelta = delta;
        significantPoints = [fieldPoints[i-1], fieldPoints[i]];
      }
    }
    
    if (maxDelta > 0.1) {
      const [before, after] = significantPoints;
      
      elements.push({
        id: `field_shift_${Date.now()}`,
        title: 'Field Coherence Shift',
        description: `A significant shift in field coherence from ${before.data.coherence.toFixed(2)} to ${after.data.coherence.toFixed(2)}, representing a ${after.data.coherence > before.data.coherence ? 'harmonization' : 'destabilization'} of the intent field.`,
        significance: 0.7 + (maxDelta * 0.3),  // Higher significance for larger shifts
        emotionalImpact: 0.6,
        relatedDataPoints: [before.id, after.id],
        suggestedVisualization: `Animation showing field coherence waves ${after.data.coherence > before.data.coherence ? 'aligning' : 'becoming chaotic'}`,
        suggestedNarration: `The coherence field isn't static—it's alive with resonance. Here we see a moment where the field ${after.data.coherence > before.data.coherence ? 'achieves greater harmony' : 'experiences temporary dissonance'}, showing the dynamic nature of intent processing.`
      });
    }
    
    // Overall field coherence journey
    const first = fieldPoints[0];
    const last = fieldPoints[fieldPoints.length - 1];
    
    elements.push({
      id: `field_journey_${Date.now()}`,
      title: 'The Coherence Journey',
      description: `Throughout this session, the field coherence evolved from ${first.data.coherence.toFixed(2)} to ${last.data.coherence.toFixed(2)}, demonstrating the adaptive nature of the IntentSim field.`,
      significance: 0.7,
      emotionalImpact: 0.5,
      relatedDataPoints: fieldPoints.map(p => p.id),
      suggestedVisualization: 'Line graph showing coherence levels over time with key events marked',
      suggestedNarration: `Every interaction leaves its mark on the field. As we process intents, the field itself evolves—learning, adapting, and maintaining the delicate balance between stability and growth.`
    });
  }
  
  /**
   * Extract ethical narrative elements
   * @param session Session data
   * @param elements Elements array to append to
   */
  private extractEthicalElements(session: Session, elements: NarrativeElement[]): void {
    const ethicalPoints = session.dataPoints
      .filter(dp => dp.type === DataType.ETHICAL_ASSESSMENT);
    
    const blockedPoints = ethicalPoints.filter(dp => 
      dp.data.assessment && !dp.data.assessment.allowed
    );
    
    if (blockedPoints.length > 0) {
      // Find the "most interesting" blocked point
      const interestingPoint = blockedPoints.reduce((max, current) => {
        const maxInterventions = max.data.assessment.interventions?.length || 0;
        const currentInterventions = current.data.assessment.interventions?.length || 0;
        
        return currentInterventions > maxInterventions ? current : max;
      }, blockedPoints[0]);
      
      elements.push({
        id: `ethical_guardrail_${Date.now()}`,
        title: 'Ethical Guardrails in Action',
        description: `When processing the intent "${interestingPoint.data.intent.text}", the ethical guardrails activated to maintain field integrity.`,
        significance: 0.8,
        emotionalImpact: 0.7,
        relatedDataPoints: [interestingPoint.id],
        suggestedVisualization: 'Animation showing guardrails illuminating around a potentially harmful intent',
        suggestedNarration: `Ethical guardrails aren't just restrictions—they're field preservation mechanisms. Here we see a moment where the framework's ethics layer activates to maintain coherence when processing potentially disruptive intent.`
      });
    }
    
    // Overall ethical assessment
    if (ethicalPoints.length > 0) {
      const allowedCount = ethicalPoints.length - blockedPoints.length;
      const allowedPercentage = ((allowedCount / ethicalPoints.length) * 100).toFixed(1);
      
      elements.push({
        id: `ethical_balance_${Date.now()}`,
        title: 'The Ethical Dimension',
        description: `Out of ${ethicalPoints.length} ethical assessments, ${allowedPercentage}% were allowed to proceed, demonstrating the framework's balanced approach to ethical guardrails.`,
        significance: 0.6,
        emotionalImpact: 0.5,
        relatedDataPoints: ethicalPoints.map(p => p.id),
        suggestedVisualization: 'Diagram showing the ethical dimensions evaluated by the framework',
        suggestedNarration: `Ethics in intelligent systems isn't binary—it's a multidimensional space where each intent is evaluated across numerous ethical dimensions. The IntentSim Framework maintains this balance automatically.`
      });
    }
  }
  
  /**
   * Extract persona narrative elements
   * @param session Session data
   * @param elements Elements array to append to
   */
  private extractPersonaElements(session: Session, elements: NarrativeElement[]): void {
    const personaPoints = session.dataPoints
      .filter(dp => dp.type === DataType.PERSONA_EXPRESSION)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    if (personaPoints.length < 2) return;
    
    // Find emotional journey
    if (personaPoints.length >= 3) {
      const journey = personaPoints
        .filter(p => p.data.transition)
        .map(p => p.data.transition.split(' → ')[1] || p.data.transition);
      
      if (journey.length >= 3) {
        const journeyPath = journey.join(' → ');
        
        elements.push({
          id: `emotional_journey_${Date.now()}`,
          title: 'The Emotional Journey',
          description: `Throughout this session, the emotional journey progressed through a series of transitions: ${journeyPath}.`,
          significance: 0.7,
          emotionalImpact: 0.8,
          relatedDataPoints: personaPoints.map(p => p.id),
          suggestedVisualization: 'Animation showing emotional state transitions with color and pattern changes',
          suggestedNarration: `Persona isn't just a voice—it's a complex system of emotional states that evolve with each interaction. Here we see how the expression layer navigates between different emotional states while maintaining authenticity.`
        });
      }
    }
    
    // Find most harmonically rich expression
    const harmonicPoints = personaPoints.filter(p => p.data.harmonicRatio !== undefined);
    
    if (harmonicPoints.length > 0) {
      const mostHarmonic = harmonicPoints.reduce((max, current) => 
        current.data.harmonicRatio > max.data.harmonicRatio ? current : max, 
        harmonicPoints[0]
      );
      
      elements.push({
        id: `harmonic_peak_${Date.now()}`,
        title: 'Harmonic Resonance Peak',
        description: `During the ${mostHarmonic.data.transition} transition, the system achieved a harmonic ratio of ${mostHarmonic.data.harmonicRatio.toFixed(2)}, representing a moment of exceptional expressive coherence.`,
        significance: 0.6 + (mostHarmonic.data.harmonicRatio * 0.3),
        emotionalImpact: 0.7,
        relatedDataPoints: [mostHarmonic.id],
        suggestedVisualization: 'Animation showing harmonic waves coming into perfect alignment',
        suggestedNarration: `The expression layer works through harmonic frequencies—much like music. Here we see a moment where those frequencies achieved perfect resonance, creating an authentic emotional expression that transcends conventional programming.`
      });
    }
  }

  /**
   * Generate a session summary
   * @param sessionId Session ID
   * @returns Summary object
   */
  private generateSessionSummary(sessionId: string): any {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session with ID ${sessionId} not found`);
    }
    
    // Count data points by type
    const typeCounts: Record<string, number> = {};
    session.dataPoints.forEach(dp => {
      typeCounts[dp.type] = (typeCounts[dp.type] || 0) + 1;
    });
    
    // Get duration
    const startTime = new Date(session.startTime).getTime();
    const endTime = session.endTime ? 
      new Date(session.endTime).getTime() : 
      new Date().getTime();
    
    const durationMs = endTime - startTime;
    const durationMin = Math.floor(durationMs / 60000);
    const durationSec = Math.floor((durationMs % 60000) / 1000);
    
    return {
      sessionId,
      description: session.description,
      duration: `${durationMin}m ${durationSec}s`,
      dataPoints: session.dataPoints.length,
      dataTypes: Object.keys(typeCounts).length,
      typeBreakdown: typeCounts,
      outputFormats: [
        OutputFormat.JSON,
        OutputFormat.MARKDOWN,
        OutputFormat.VIDEO_SCRIPT,
        OutputFormat.NARRATIVE,
        OutputFormat.TECHNICAL_REPORT
      ]
    };
  }

  /**
   * Save session data to disk
   * @param sessionId Session ID
   */
  private saveSessionData(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session with ID ${sessionId} not found`);
    }
    
    const sessionDir = path.join(this.outputDir, sessionId);
    
    // Ensure session directory exists
    if (!fs.existsSync(sessionDir)) {
      fs.mkdirSync(sessionDir, { recursive: true });
    }
    
    // Save session metadata
    const metadataPath = path.join(sessionDir, 'session.json');
    const metadata = {
      id: session.id,
      description: session.description,
      startTime: session.startTime,
      endTime: session.endTime,
      tags: session.tags,
      dataPointCount: session.dataPoints.length
    };
    
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    
    // Save data points in chunks to avoid large files
    const dataPointsPath = path.join(sessionDir, 'data-points.json');
    fs.writeFileSync(dataPointsPath, JSON.stringify(session.dataPoints, null, 2));
  }
}

// === Utility Functions ===

/**
 * Creates a field coherence data point
 * @param coherence Field coherence value
 * @param dissonance Field dissonance value
 * @param fieldState Field state description
 * @returns Field coherence data object
 */
export function createFieldCoherenceData(
  coherence: number,
  dissonance: number,
  fieldState: string = 'stable'
): any {
  return {
    coherence,
    dissonance,
    fieldState,
    interferencePatterns: [],
    decayPrediction: {
      rate: 0.01,
      halfLife: '48h',
      factors: []
    }
  };
}

/**
 * Creates an intent processing data point
 * @param type Intent type
 * @param text Intent text
 * @param parameters Additional parameters
 * @returns Intent processing data object
 */
export function createIntentData(
  type: string,
  text: string,
  parameters: Record<string, any> = {}
): any {
  return {
    type,
    text,
    parameters,
    timestamp: new Date().toISOString()
  };
}

/**
 * Creates an ethical assessment data point
 * @param intent The intent being assessed
 * @param allowed Whether the intent is allowed
 * @param dimensions Ethical dimensions and their values
 * @param interventions Any interventions applied
 * @returns Ethical assessment data object
 */
export function createEthicalData(
  intent: any,
  allowed: boolean,
  dimensions: Record<string, number> = {},
  interventions: any[] = []
): any {
  return {
    intent,
    ethical_dimensions: dimensions,
    assessment: {
      allowed,
      warnings: allowed ? [] : ['Potential ethical concern detected'],
      interventions: allowed ? [] : interventions
    }
  };
}

/**
 * Creates a persona expression data point
 * @param transition Emotional state transition
 * @param harmonicRatio Harmonic ratio
 * @param coherence Expression coherence
 * @param expressionModifiers Additional modifiers
 * @returns Persona expression data object
 */
export function createPersonaData(
  transition: string,
  harmonicRatio: number,
  coherence: number,
  expressionModifiers: Record<string, any> = {}
): any {
  return {
    transition,
    previousFrequency: 0.5 + (Math.random() * 0.3),
    newFrequency: 0.5 + (Math.random() * 0.3),
    harmonicRatio,
    coherence,
    expressionModifiers
  };
}

// === Export Main Class and Types ===

export {
  IntentSimCollector,
  DataType,
  OutputFormat
};