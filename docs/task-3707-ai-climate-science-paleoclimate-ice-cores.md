# AI in Climate Science & Earth System Models

## Overview

Climate science is the study of the Earth's climate system—its components (atmosphere, hydrosphere, cryosphere, lithosphere, biosphere), their interactions, and their evolution over time. Earth System Models (ESMs) are the primary tools for projecting future climate change. They divide the Earth's surface and atmosphere into a 3D grid and simulate the physical, chemical, and biological processes that determine climate at each grid point: atmospheric dynamics, ocean circulation, cloud formation, precipitation, ice sheet behavior, vegetation dynamics, and biogeochemical cycles including the carbon cycle.

Current ESMs (CMIP6, the sixth phase of the Coupled Model Intercomparison Project) typically operate at horizontal resolutions of 50-100 km per grid cell. While this is sufficient to capture large-scale climate features, it misses critical small-scale processes—individual clouds, convective storms, small islands, urban heat islands—that have outsized effects on regional climate. Improving this resolution requires either more computational power (exascale computing) or smarter modeling (AI-enhanced parameterizations).

Climate science also faces a data challenge: the volume of observational data (satellite sensors, weather stations, ocean buoys, ice cores) is growing exponentially, and extracting meaningful insights requires ML. Simultaneously, AI is being used to accelerate ESMs, downscale global projections to regional scales, detect extreme weather events, attribute climate change to human activities, and guide climate intervention strategies.

---

## AI Applications

### Earth System Model Acceleration

ESM simulations are computationally expensive. A single century-long simulation at high resolution can require weeks to months on supercomputers. This limits the number of scenarios that can be explored and the ensemble sizes needed for uncertainty quantification.

ML is being used to accelerate ESMs in several ways:

- **ML-based subgrid-scale parameterizations**: Clouds, convection, and turbulence occur at scales smaller than ESM grid cells and must be statistically parameterized. ML models (particularly neural networks and GNNs) trained on high-resolution simulation data (Large Eddy Simulations) can learn parameterizations that are more accurate than traditional empirical formulas and faster to evaluate.
- **Neural emulators**: Entire ESM components—or even whole models—can be replaced by neural networks trained on existing model output. The Digital Twin Earth project (ESA) and similar efforts are developing Earth system emulators that can make climate projections in seconds rather than weeks.
- **Super-resolution of climate data**: ML models that take coarse-resolution model output and generate high-resolution regional projections (downscaling), capturing local topography and coastlines more faithfully.

Notable projects include:
- **NVIDIA's Earth-2**: A climate digital twin using Fourier neural operators for rapid simulation
- **Google's GraphCast**: ML-based weather forecasting that outperforms the ECMWF IFS in many metrics
- **DeepMind's NowcastNet**: ML for precipitation nowcasting
- **Microsoft's Aurora**: Foundation model for atmospheric physics

### Extreme Weather Event Detection and Attribution

Climate change is increasing the frequency and intensity of extreme weather events: heat waves, droughts, floods, hurricanes, and wildfires. AI is transforming how we detect, predict, and attribute these events:

- **Detection**: CNNs and transformer models trained on satellite imagery and radar data can identify tropical cyclones, atmospheric rivers, and severe storms with accuracy competitive with or exceeding human experts
- **Attribution**: ML-based attribution studies quantify the extent to which a specific extreme event was made more likely or more severe by anthropogenic climate change. This combines physical modeling with statistical ML on historical data.
- **Event detection in paleoclimate data**: AI applied to ice core, sediment core, and tree-ring data to identify past extreme events (volcanic eruptions, abrupt climate changes) that inform understanding of climate sensitivity

### Climate Data Reconstruction and Gap-Filling

Historical climate records are incomplete and unevenly distributed. AI methods for reconstruction include:

- **Reanalysis products**: ML-based methods that combine sparse observations with physical models to produce complete gridded climate datasets (ERA5, JRA-55 reanalyses increasingly incorporate ML corrections)
- **Paleoclimate reconstruction**: Using neural networks to reconstruct past temperatures, precipitation, and other variables from proxy data (ice cores, tree rings, corals, sediments)
- **Satellite data interpolation**: Filling gaps in satellite records (e.g., from equipment failures) using ML
- **Predicting unobserved variables**: Using ML to estimate variables not directly measured but related to observed quantities

### Carbon Cycle and Biogeochemistry

The global carbon cycle—how carbon moves between atmosphere, ocean, land, and biosphere—is central to climate projections. AI is applied to:
- **Terrestrial carbon uptake prediction**: ML models that predict photosynthesis, respiration, and carbon storage across ecosystems
- **Ocean carbon sink modeling**: Neural networks that model air-sea CO2 exchange and ocean carbon transport
- **Methane emissions estimation**: Using satellite data (TROPOMI on Sentinel-5P) and ML to estimate methane emissions from cattle, rice paddies, wetlands, and fossil fuel infrastructure
- **Permafrost carbon feedback**: Modeling how thawing permafrost releases CO2 and methane

### Climate Model Ensembling and Uncertainty Quantification

Climate projections are inherently uncertain because of internal variability (the chaotic nature of the climate system), model uncertainty (different models give different results), and scenario uncertainty (future emissions depend on human choices). AI helps:

- **Model weighting**: Bayesian ML methods that weight climate model projections by their historical skill
- **Ensemble generation**: Using generative models (GANs, diffusion models) to create plausible ensembles of future climate states
- **Uncertainty decomposition**: ML models that separate and quantify different sources of uncertainty

### Regional Climate Downscaling

Global ESM output is too coarse for local impact studies (agriculture, infrastructure, water management). AI downscaling methods include:
- **Statistical downscaling**: ML models trained on historical global-local pairs to predict local climate from global projections
- **Dynamic downscaling**: Using ML to accelerate the nested regional models (WRF, RegCM) that zoom in on specific regions
- **Object-based downscaling**: ML methods that preserve the statistics of extreme events when going from coarse to fine resolution

---

## Tools and Methods

### Earth System Modeling Platforms

- **CESM (Community Earth System Model)**: The US flagship ESM
- **EC-Earth**: The European consortium ESM
- **GFDL-ESM**: NOAA's Geophysical Fluid Dynamics Laboratory ESM
- **IPSL-CM**: Institut Pierre Simon Laplace model
- **XESM**: Infrastructure for model intercomparison and coupling

### ML Frameworks for Climate

- **ClimateLearn**: MIT library for climate ML
- **PyTorch-Geometric**: For graph-based climate modeling (e.g., weather prediction with GNNs)
- **Windspharm**: Spherical harmonic analysis for atmospheric data
- **xarray**: The standard Python package for labeled multi-dimensional arrays in climate science
- **ClimDataRecipe**: Data processing pipeline for climate datasets

### Satellite and Observational Platforms

- **NASA GPM/TRMM**: Global precipitation measurement
- **ESA Sentinel satellites**: Land, ocean, and atmospheric monitoring
- **NASA ECOSTRESS**: Thermal infrared ecosystem stress
- **ICESat-2**: Ice sheet elevation
- **GRACE-FO**: Gravity anomalies indicating water mass changes

---

## Challenges

### Physical Consistency and Conservation

ML models trained on climate data can violate fundamental physical laws (conservation of mass, energy, momentum; thermodynamic constraints). This can lead to physically implausible predictions when models are used out-of-distribution—a critical concern for climate projections that by definition explore futures outside the historical training distribution.

Techniques to address this:
- **Physics-informed neural networks (PINNs)**: Loss functions that penalize violations of known physical laws
- **Neural ODEs and Hamiltonian neural networks**: Models that respect conservation by construction
- **Hybrid physics-ML models**: Where ML replaces only the uncertain components and physics constrains the rest

### Long-Tail Events and Distribution Shift

Climate projections are inherently about futures different from the past. ML models trained on historical data may be confident but wrong about unprecedented conditions. Climate change is non-stationary: the relationship between predictors and predictands shifts as the base state changes. Detecting and accounting for this is an active research problem.

### Interpretability for Policy

Climate projections inform policy decisions with trillions of dollars of implications. ML models that make predictions without explaining why—particularly about irreversible tipping points or catastrophic scenarios—face skepticism from policymakers and the public. Interpretable ML for climate is essential for building trust and enabling targeted policy responses.

### Data Heterogeneity and Quality

Climate data comes from highly heterogeneous sources: thousands of weather stations with different instruments and quality, satellites with different resolutions and revisit times, ice cores with different dating methods, ocean buoys with different configurations. Integrating these into consistent ML training datasets requires extensive preprocessing and uncertainty quantification.

### Computing Infrastructure

Training large ML models on climate data requires significant computational resources. The climate community has traditionally relied on publicly funded HPC facilities; cloud computing offers flexibility but raises costs and energy concerns.

---

## Ethics

### Climate Justice and Differential Vulnerability

Climate change disproportionately affects the world's poorest populations, who have contributed least to emissions. AI-driven climate projections can help these vulnerable communities prepare—but if the models are trained primarily on data from well-instrumented wealthy regions (North America, Europe), their accuracy for vulnerable regions (Sub-Saharan Africa, Small Island Developing States) may be poor. This "data poverty" problem creates a feedback loop of neglect.

### Maladaptation and False Confidence

ML-generated climate projections—particularly when presented with apparent precision—could lead to maladaptation: investments in infrastructure or agriculture optimized for an ML projection that turns out to be wrong. Communicating uncertainty honestly is essential, yet ML models often produce overconfident point estimates.

### Geoengineering and Moral Hazard

AI models that simulate the effects of climate interventions (solar radiation management, carbon dioxide removal) could reduce the perceived risk of inaction, creating a moral hazard. If society believes AI can reverse climate change cheaply, it may be less inclined to reduce emissions urgently. Governance frameworks for geoengineering research must account for this.

### Dual Use: Fossil Fuel Industry

AI tools developed for climate science can also be used by the fossil fuel industry for exploration and extraction efficiency. The same ML models that identify methane leaks can identify underground reservoirs. The net effect on emissions is ambiguous and context-dependent.

---

## Future Directions

### Digital Twin Earth

The concept of a "Digital Twin Earth"—a continuously updated, high-fidelity computational replica of the entire planet—is gaining traction. The EU's Destination Earth initiative and NASA's Open-Earth Cube project aim to build such systems, integrating satellite observations, in-situ sensors, and ESMs with AI. Such a system could enable unprecedented prediction and monitoring of climate change.

### Tipping Point Detection

Critical tipping points—where small perturbations trigger large, potentially irreversible changes (Amazon dieback, West Antarctic Ice Sheet collapse, Atlantic Meridional Overturning Circulation shutdown)—are among the most consequential and least well-modeled aspects of climate. AI methods that detect early warning signals in observational data (increasing variance, autocorrelation, spatial correlation) and that model the bistable dynamics of tipping elements are active research areas.

### AI-Guided Climate Interventions

If climate interventions (CDR, SRM) are deployed, AI will be essential for monitoring their effects and optimizing their implementation. Bayesian optimization, reinforcement learning, and causal inference will be needed to manage complex intervention systems under deep uncertainty.

### Fusion with Weather Forecasting

The boundary between weather forecasting (days to weeks) and climate projection (decades to centuries) is blurring. ML models like GraphCast and Pangu-Weather have demonstrated that ML can outperform physics-based models for weather prediction. If these methods can be extended to seasonal and decadal scales, they could transform climate risk assessment.

---

*This memo was compiled as part of Cycle 122 research documentation. Last updated: 2026-04-11.*
