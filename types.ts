
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
  formationBalancingSteps?: string; // خطوات وزن تكوين الجزيء من الذرات
  academicContext?: string; // الشرح الأكاديمي العميق
  
  // الخصائص الفيزيائية
  molecularDensity?: string;
  acidBase?: string;
  applications?: string;
  commonality?: string; 
  molarMass?: string;
  state?: string;
  molecularGeometry?: string;
  reactionType?: string; 
  lewisStructure?: string;
  
  // الخصائص المتقدمة
  hybridization?: string;
  polarity?: string;
  magneticDescription?: string;
  solubilityInWater?: string; // Updated
  solubilityInOrganicSolvents?: string; // New
  crystalDescription?: string;
  
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
  environmentalImpact?: string; // Used for Lewis Structure image of main product
}

export interface OrganicCompoundInfo {
  id: string;
  name: string;
  formula: string;
  family: string;
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
}

export interface BatteryInfo {
    id: string;
    name: string;
    type?: string;
    nominalVoltage: string;
    applications: string;
    diagramImage: string;
    energyDensity?: string;
    cycleLife?: string;
    anodeMaterial?: string;
    cathodeMaterial?: string;
    electrolyte?: string;
    chargingCharacteristics?: string;
    selfDischargeRate?: string;
    anodeReaction?: string;
    cathodeReaction?: string;
    safetyRisks?: string;
    environmentalRecycling?: string;
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
  electrolyte: string;
  diagramImage: string;
  minVoltage: string;
  anodeReaction: string;
  cathodeReaction: string;
  applications: string;
  anodeProduct?: string;
  cathodeProduct?: string;
}
