# AI in Astronomy, Exoplanets & SETI

## Overview

Astronomy is inherently a data-driven science. The universe is vast, the phenomena are diverse, and the instrumentation is powerful. Modern telescopes and surveys produce data at rates far exceeding what human analysts can process. The James Webb Space Telescope (JWST), operational since 2022, can produce terabytes of data per day from its infrared observations. The Vera C. Rubin Observatory (LSST, expected full operations 2026) will image the entire southern sky every few nights, generating tens of petabytes of image data over its lifetime. The Square Kilometre Array (SKA), now entering its early science phase, will produce data at rates exceeding the entire global internet traffic of the early 2000s.

This data deluge demands AI solutions. Machine learning is now applied across the entire astronomical pipeline: from raw image processing, through source detection and classification, to the scientific interpretation of celestial objects. Beyond data processing, AI is enabling new kinds of discovery: identifying anomalies that existing pipelines miss, detecting faint signals in noisy data, and even suggesting new scientific hypotheses.

The applications span the full range of astronomical subfields: galaxy classification, stellar population analysis, exoplanet detection and characterization, gravitational wave detection, transient event identification (supernovae, neutron star mergers, tidal disruption events), and the search for extraterrestrial intelligence (SETI). Each domain presents unique challenges and opportunities for AI.

---

## AI Applications

### Exoplanet Detection

Exoplanets—planets orbiting stars other than the Sun—are detected through several methods, all of which benefit from AI:

- **Transit photometry**: The Kepler and TESS missions detect planets by measuring the tiny dip in a star's brightness as a planet passes in front of it (a transit). The signal is subtle, buried in stellar variability, instrumental systematic errors, and photon noise. ML classifiers (CNNs, random forests,梯度 boosted trees) applied to light curves can detect transit signals that are missed by traditional periodogram methods.
  - **Robovetter**: NASA's automated vetting pipeline for Kepler planet candidates, now substantially enhanced with ML
  - **AstroNet**: Deep learning for transit detection in TESS data
  - **Exoplanet detection in JWST data**: ML models trained on simulated and real JWST light curves to identify planetary atmospheres from spectroscopic data

- **Radial velocity (RV)**: Detecting the reflex motion of a star as a planet orbits it, seen as Doppler shifts in the stellar spectrum. RV datasets are time-series with complex correlated noise (stellar magnetic activity cycles, instrument systematics). Gaussian Processes and neural network models can separate planetary signals from stellar noise.
  - **Bayesian hierarchical models**: Combining RV data with stellar activity proxies (chromospheric indices, photometric variability) using ML

- **Direct imaging**: Blocking out the glare of a star to image planets directly. This requires coronagraphy and extreme adaptive optics. ML is used for post-processing to remove residual speckle noise (spot nulling, PCA-based methods)

### Astronomical Survey Classification and Catalogs

The volume of survey data exceeds human capacity for classification. AI is essential:

- **Galaxy morphology**: Classifying galaxy shapes (elliptical, spiral, irregular) from images. CNNs trained on labeled datasets (Galaxy Zoo citizen science labels) achieve human-level accuracy. The TNG (IllustrisTNG) simulation data and observed data from HSC (Hyper Suprime-Cam) are training datasets.
  - **Zoobot**: Galaxy classification model trained on Galaxy Zoo labels; open-source and used by multiple survey teams
  - **Deep Learning for JWST CEERS survey**: Morphological classification of distant galaxies at unprecedented redshift

- **Stellar classification**: Classifying stars by their spectral type, chemical composition, and evolutionary stage. ML on spectroscopic data (SVM, random forests, neural networks) enables automated spectral classification at scale.

- **Transient and variable star classification**: Identifying supernovae, cataclysmic variables, active galactic nuclei, and other transient events from light curves.
  - **Antares**: Real-time alert broker for LSST/ Rubin that classifies alerts within seconds
  - **RAPID**: Recurrent Neural Network for optical light curves

### Gravitational Wave Detection

Gravitational waves—ripples in spacetime from colliding black holes and neutron stars—were first directly detected by LIGO in 2015. Detection requires finding weak signals buried in detector noise (a strain of 10^-21 or less). This is a pattern recognition problem where ML has made major contributions:

- **Signal detection**: CNNs and RNNs trained on simulated signals and real noise can detect signals with lower false alarm rates than traditional matched filtering in some regimes.
- **Parameter estimation**: Neural networks that estimate source properties (masses, spins, sky location, distance) from detected signals in milliseconds rather than the hours required by traditional Bayesian inference.
- **Noise characterization**: ML models that identify and subtract non-stationary noise artifacts (glitches) in LIGO/Virgo data

Key projects: Deep Learning for Gravitational Waves (ML4GW), the AEI Hannover group, and the LIGO Scientific Collaboration's dedicated ML working group.

### Astronomical Anomaly Detection

Perhaps the most exciting application of AI in astronomy is detecting things that weren't expected—cosmic phenomena that don't match known categories. Traditional pipelines are designed to find known types; AI can identify anomalies that:

- Don't match any labeled class with high confidence
- Deviate from the expected population statistics
- Change behavior over time in unexpected ways

Methods include:
- **Autoencoders on light curves**: Train on normal stellar variability; flag high-reconstruction-error events as anomalies
- **Isolation forests on source catalogs**: Identify outliers in multi-dimensional feature spaces
- **One-class SVMs on spectra**: Identify unusual spectral energy distributions
- **JWST anomaly detection**: Applying deep learning to identify unusual objects in JWST images that weren't targeted by the survey design

Notable discoveries enabled by ML include:
- Star galaxies that were misclassified
- AGNs (Active Galactic Nuclei) in unexpected environments
- Unusual transient events (the "Cow" event, AT2018cow, was flagged by ML)

### SETI (Search for Extraterrestrial Intelligence)

SETI searches for technosignatures—evidence of technological activity by extraterrestrial civilizations. Radio SETI has historically searched for narrowband signals (like an intentional beacon), but AI enables broader searches:

- **Wide-band signal classification**: ML classifiers that identify narrowband radio signals in wide-band data, distinguishing potential extraterrestrial signals from human radio frequency interference (RFI)
- **Anomaly-based SETI**: Instead of searching for specific expected signals, using autoencoders or one-class classifiers to flag any signal that is statistically anomalous
- **Technosignature candidate scoring**: ML models that assign probability scores to candidate signals, prioritizing follow-up observations
- **SETI at scale with MeerKAT and MWA**: ML pipelines processing millions of radio channels simultaneously

The Breakthrough Listen initiative uses ML extensively for SETI analysis, including the recent detection of candidate signals that remain under investigation.

### Cosmological Parameter Estimation

The large-scale structure of the universe—the distribution of galaxies, cosmic microwave background (CMB) fluctuations, weak gravitational lensing—encodes information about cosmological parameters (dark matter density, dark energy equation of state, neutrino masses). AI methods include:

- **CMB analysis**: CNNs for CMB maps (temperature and polarization) to constrain inflation models
- **Weak lensing**: Neural networks for shear measurement, redshift estimation, and cosmological inference from galaxy surveys
- **BAO (Baryon Acoustic Oscillation) spectroscopy**: ML models that estimate distances from galaxy spectra with high precision
- **Simulation-based inference**: Using generative models (NPE, diffusion models) to infer cosmological parameters from observations

---

## Tools and Methods

### Survey Pipelines and Data Formats

- **LSST Science Pipelines (now Rubin Science Pipelines)**: The processing pipeline for Rubin Observatory data
- **AstroPy**: The standard Python library for astronomy; includes coordinate transformations, FITS I/O, and astronomical calculations
- **Montage**: Astronomical image mosaic engine
- **SAOImage DS9**: Image viewer for astronomical data (increasingly supplemented by web-based alternatives)

### ML Frameworks for Astronomy

- **Astronomical Machine Learning**: A subfield with specialized tools
- **RAPID, ANTARES, Lasair**: Transient alert brokers for Rubin and other surveys
- **Bilby**: Bayesian inference library for gravitational wave analysis
- **cpnest, dynesty**: Nested sampling for Bayesian parameter estimation

### Astronomical Archives

- **MAST (Mikulski Archive for Space Telescopes)**: HST, Kepler, TESS, JWST data
- **IRSA**: NASA/IPAC Infrared Science Archive
- **VizieR**: Catalog service at CDS, Strasbourg
- **Aladin**: Interactive sky atlas for browsing astronomical images and catalogs
- **Simbad**: Bibliographic database of astronomical objects

### Simulation

- **IllustrisTNG**: Cosmological simulation with galaxy formation
- **EAGLE**: Hydrodynamical simulation
- **Colossus**: Cosmology calculator for halo mass function, dark matter profiles
- **gadget-4, AREPO, SWIFT**: N-body and hydrodynamical codes

---

## Challenges

### Catalog Systematics and Selection Effects

Astronomical catalogs are subject to selection effects—what you see depends on what you look for. ML models trained on existing catalogs inherit these biases. For example, a galaxy classifier trained on a magnitude-limited sample will be biased against faint objects. Quantifying and correcting for these biases is challenging.

### Out-of-Distribution Generalization

Astronomical ML models are trained on historical data, but the most interesting applications are to new data from new instruments (JWST, Rubin, SKA) operating in regimes where the training data is sparse. Models that are overconfident on out-of-distribution data are dangerous; ML for astronomy must grapple with the unknown unknowns.

### Interpretability for Discovery Science

When an ML model flags an anomaly or classifies an unusual object, scientists want to know why. Interpretability tools (SHAP, attention maps, TCAV) are being adapted for astronomical applications, but the community lacks standards for what constitutes sufficient explanation.

### Real-Time Processing at Scale

Rubin Observatory will generate ~20 TB of images per night and issue millions of alerts for transients. Real-time ML classification within seconds of image acquisition is required. This demands optimized ML inference on GPU clusters, careful systems engineering, and graceful degradation strategies.

### Cross-Match Completeness

Astronomical objects must be cross-matched across multiple wavelengths and surveys, each with different spatial resolution, sensitivity, and systematic errors. Probabilistic catalog cross-matching with ML is an active area.

---

## Ethics

### Space Debris and Orbital Pollution

While not directly astronomy, AI in space situational awareness—tracking satellites, debris, and managing orbital slots—is becoming critical as Starlink and other mega-constellations proliferate. This intersects with astronomy through interference with ground-based observations.

### Data Access and Equity

Major astronomical archives (HST, JWST, LIGO) are hosted by space agencies and observatories in wealthy nations. Researchers from developing countries often have limited access. Open-data initiatives (the International Astronomical Union's Open Universe initiative, open-source analysis tools) attempt to democratize access, but disparities persist.

### SETI Signal Reporting and Responsibility

If ML systems identify a candidate SETI signal, the protocols for disclosure are informal and ad hoc. The scientific, media, and public reaction to such a discovery could be enormous and destabilizing. The SETI community has post-detection protocols, but AI-generated candidates add complexity.

### Misuse of Astronomical Data

The same ML tools used to detect exoplanets can be adapted for surveillance applications (tracking satellites, detecting faint signals). Astronomical data from commercial remote sensing satellites is increasingly accessible. The dual-use concern is real but not well-quantified.

---

## Future Directions

### AI-Accelerated Discovery

The long-term vision is an AI system that not only processes data but generates hypotheses—suggesting new physical models, identifying unexplained phenomena, and even discovering new astronomical objects or laws. Neural network-based symbolic regression (Eureqa, FermiNet) has shown that AI can rediscover physical laws from data. Extending this to astronomical discovery is speculative but compelling.

### Multi-Messenger Astronomy

Gravitational waves, neutrinos, cosmic rays, and electromagnetic radiation provide complementary views of the same astrophysical events. AI will increasingly be used to correlate signals across these messengers in real time, triggering follow-up observations and building a more complete picture of violent cosmic events.

### JWST Science and the Early Universe

JWST is revealing the universe in unprecedented infrared detail, including galaxies from the first billion years. AI is essential for:
- Identifying and classifying high-redshift galaxy candidates
- Extracting atmospheric spectra from noisy exoplanet transit data
- Modeling galaxy formation in the epoch of reionization

### Citizen Science and Hybrid Intelligence

Projects like Galaxy Zoo show that human cognition remains valuable for certain classification tasks. Hybrid systems that combine ML classification with human judgment—via active learning (ML asks humans to label uncertain cases) or ensemble approaches—can achieve better results than either alone.

### SKA and Next-Generation Facilities

The SKA, the Extremely Large Telescope (ELT), and the Nancy Grace Roman Space Telescope will generate data volumes and scientific opportunities that demand continued advancement in astronomical AI. These facilities will probe new regimes where AI discoveries may be the most exciting results.

---

*This memo was compiled as part of Cycle 122 research documentation. Last updated: 2026-04-11.*
