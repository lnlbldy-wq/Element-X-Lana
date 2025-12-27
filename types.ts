
export interface Atom {
  id: string;
  name: string;
  symbol: string;
  color: string;
  textColor: string;
  radius: number;
  valency?: string; 
  oxidationStates?: number[];
  instanceId?: number;
  x?: number;
  y?: number;
  electronConfiguration?: string; // التوزيع المختصر
  fullElectronConfiguration?: string; // التوزيع المداري المفصل
  magneticDescription?: string; // الوصف المغناطيسي (بارا/دايا)
}

export interface AtomBreakdown {
  atomName: string;
  atomSymbol: string;
  config: string;
  description: string;
}

export interface Reaction {
  id: string;
  name: string;
  formula: string;
  emoji: string;
  reactants: string[];
  bondType: string;
  explanation: string;
  balancedFormationEquation?: string; 
  formationBalancingSteps?: string;
  academicContext?: string;
  atomBreakdown?: AtomBreakdown[];
  
  // الخصائص الفيزيائية
  // FIX: Renamed molecularDensity to density and added missing physical properties to match schema.
  density?: string;
  acidBase?: string;
  applications?: string;
  commonality?: string; 
  molarMass?: string;
  state?: string;
  molecularGeometry?: string;
  reactionType?: string; 
  lewisStructure?: string;
  boilingPoint?: string;
  meltingPoint?: string;
  
  // الخصائص المتقدمة
  hybridization?: string;
  polarity?: string;
  electronegativityDifference?: string;
  dipoleMoment?: string;
  vanDerWaalsRadius?: string;
  magneticDescription?: string;
  solubilityInWater?: string;
  solubilityInOrganicSolvents?: string;
  crystalDescription?: string;
  thermalStability?: string;
  bondEnthalpy?: string;
  // FIX: Added missing electron configuration properties to match schema.
  electronConfiguration?: string;
  fullElectronConfiguration?: string;
  
  // التاريخ والاكتشاف
  discoverer?: string;
  discoveryYear?: string | number;
  discoveryStory?: string;

  safety?: {
    warnings: string[];
    ghsSymbols: string[];
  };
}

export interface Product {
  name: string;
  formula: string;
  state: string; 
}

export interface CompoundReaction {
  id: string; 
  balancedEquation: string;
  balancingSteps?: string; 
  academicContext?: string; 
  reactionType: string;
  explanation: string;
  reactionMechanism?: string;
  colorChange?: string; 
  visualObservations?: string;
  reactionConditions?: string;
  thermodynamicNotes?: string;
  industrialApplications?: string; 
  kinetics?: {
      rateLaw: string;
      activationEnergy: string;
      catalysisMechanism: string;
  };
  equilibrium?: {
      kpKcExpression: string;
  };
  products: Product[];
  safetyNotes: string[];
  environmentalImpact?: string;
}

export interface OrganicCompoundInfo {
  id: string;
  name: string;
  formula: string;
  family: string;
  functionalGroups?: string[];
  commercialNames?: string;
  description: string;
  uses: string;
  stateAtSTP: string;
  iupacNaming: string;
  boilingPoint?: string;
  meltingPoint?: string;
  solubility?: string; 
  lewisStructureImage?: string; 
  density?: string;
  isomersCount?: string | number;
  toxicityDetails?: string;
  flammabilityRating?: string;
}

export interface BiomoleculeInfo {
  id: string;
  name: string;
  formula: string;
  type: string;
  description: string;
  biologicalFunction: string;
  structureImage: string;
  uses?: string;
  molecularWeight?: string;
  prevalenceInNature?: string;
  metabolicRole?: string;
  dietarySources?: string;
  clinicalImplications?: string;
  associatedDiseases?: string;
}

export interface GalvanicCellInfo {
  id: string;
  anode: { metal: string; halfReaction: string; standardPotential: string; };
  cathode: { metal: string; halfReaction: string; standardPotential: string; };
  overallReaction: string;
  cellPotential: string;
  cellNotation?: string;
  explanation: string;
  diagramImage: string;
  applications?: string;
  gibbsEnergy?: string;
  theoreticalYieldInfo?: string;
}

export interface ThermoChemistryInfo {
  id: string;
  equation: string;
  enthalpyChange: string; 
  isExothermic: boolean;
  explanation: string;
  energyProfileImage: string; 
  applications?: string;
  isSpontaneous?: boolean;
  entropyChange?: string;
  gibbsFreeEnergyChange?: string;
  keq?: string;
  activationEnergy?: string;
  speedFactors?: string[];
  heatCapacityInfo?: string;
}

export interface SolutionChemistryInfo {
  id: string;
  soluteName: string;
  soluteFormula: string;
  solventName: string;
  concentrationMolarity: string;
  solutionDescription: string;
  applications?: string;
  solutionType?: string;
  phLevel?: string;
  conductivity?: string;
  boilingPointElevation?: string;
  freezingPointDepression?: string;
  osmoticPressure?: string;
}

export interface BatteryInfo {
    id: string;
    name: string;
    type: string;
    nominalVoltage: string;
    applications: string;
    energyDensity: string;
    cycleLife: string;
    internalResistance?: string;
    anodeMaterial: string;
    cathodeMaterial: string;
    electrolyte: string;
    chargingCharacteristics?: string;
    selfDischargeRate?: string;
    anodeReaction: string;
    cathodeReaction: string;
    safetyRisks?: string;
    environmentalRecycling?: string;
    diagramImage?: string;
}

export interface BatteryComparisonPoint {
    title: string;
    description: string;
}
export interface BatteryComparisonInfo {
    comparisons: BatteryComparisonPoint[];
}

export interface HistoryInfo {
    topic: string;
    summary: string;
    events: {year: string; title: string; description: string; scientist: string}[];
    illustrationImage: string;
    impactOnSociety?: string;
    nobelPrizes?: string;
}

export interface ElectrolysisInfo {
  id: string;
  electrolyte: string;
  minVoltage: string;
  anodeProduct: string;
  anodeReaction: string;
  cathodeProduct: string;
  cathodeReaction: string;
  diagramImage: string;
  applications: string;
}
