# AI in Space Archaeology & Satellite Imagery Analysis

Space archaeology — the use of satellite and aerial imagery to discover and monitor archaeological sites — has transformed how we find and study the past. The majority of archaeological sites on Earth have never been formally documented; many are unknown even to local populations. Satellite imagery, combined with AI analysis, is now enabling systematic surveys of entire continents, revealing the hidden patterns of ancient human settlement at scales impossible from the ground.

## From Corona to Sentinel: Earth Observation for Archaeology

The space archaeology revolution began with declassified Cold War reconnaissance imagery from the American CORONA satellite program (1960-1972), which revealed thousands of previously unknown archaeological features in the Middle East. Since then, the tools have multiplied: commercial high-resolution imagery (Maxar, Planet Labs), open-access Sentinel and Landsat satellites, synthetic aperture radar (SAR) that can see through vegetation and sand, and LiDAR mounted on aircraft that penetrates forest canopy to reveal the ground surface below.

The challenge is volume. A single Landsat scene covers 170 km × 185 km; the entire Earth's land surface has been imaged thousands of times across multiple satellite programs. Human analysts cannot review more than a tiny fraction of this data. AI is now doing the initial screening, identifying candidate sites for follow-up investigation.

## Computer Vision for Feature Detection

The core method of satellite archaeology is visual pattern recognition — identifying the signatures of human activity preserved in the landscape. Ancient settlements often create distinctive patterns: raised tells from accumulated debris, geometric enclosures from fortified camps, linear features from roads or field boundaries, circular marks from ancient wells or burial mounds. AI models trained on examples of known archaeological features can now identify these patterns with accuracy comparable to expert analysts.

Convolutional neural networks (CNNs) and vision transformers trained on labeled archaeological datasets can detect features ranging from paleochannels (ancient riverbeds) to burial mounds to ancient field systems. The most effective models use multispectral imagery — combining visible light with infrared and thermal bands — since different wavelengths reveal different features. Vegetation growing over buried walls often appears stressed or differently colored; soil types that differ from surroundings reveal disturbance; moisture patterns highlight buried features.

## Lidar and the Discovery of Hidden Cities

Perhaps the most dramatic success of space archaeology has been the use of LiDAR (Light Detection and Ranging) to reveal ancient cities hidden beneath tropical forest canopy. In Cambodia, LiDAR surveys of the Angkor region revealed a vast urban landscape beneath the modern jungle — a city larger than previously imagined, with roads, canals, and reservoirs completely invisible from the ground. In Mexico, LiDAR has revealed that the Maya civilization built cities far more extensive and densely populated than ground surveys suggested.

AI is accelerating the analysis of LiDAR data, automatically classifying terrain features, identifying raised platforms and building foundations, and reconstructing ancient road networks. The processing of a single LiDAR survey — which can cover hundreds of square kilometers at centimeter resolution — generates billions of data points. Deep learning models can now process this data in hours rather than the months that manual interpretation required.

## Monitoring Looting and Site Damage

Beyond discovery, satellites enable systematic monitoring of site condition. The destruction of archaeological sites by looting, development, agriculture, and conflict has been documented at an unprecedented scale through satellite monitoring. In Syria, Iraq, and Yemen, satellite imagery has revealed the systematic destruction of World Heritage sites by armed groups, providing evidence for war crimes prosecutions and enabling UNESCO damage assessments.

AI makes this monitoring continuous and scalable. Change detection algorithms compare satellite images from different dates, automatically flagging sites where new disturbance has occurred. This has been particularly valuable in the Middle East, where conflict and instability make on-ground monitoring impossible, and in Latin America, where expanding agriculture and mining threaten undocumented sites across vast areas.

## Predicting Site Locations

Beyond detecting known sites, AI is being used to predict where undiscovered sites are likely to be found — a task sometimes called "predictive modeling." By analyzing the environmental and geographical factors associated with known sites (distance to water, elevation, slope, soil type, distance to other sites), machine learning models can generate probability maps showing where archaeological sites are most likely to exist.

These models have proven remarkably effective. In Scandinavia, predictive models based on Viking-era settlement data identified previously unknown farmsteads and burial sites with high accuracy. In the American Southwest, models trained on Pueblo settlement patterns successfully predicted sites that were later confirmed by ground survey. The most sophisticated models combine physical geography with social network analysis, predicting not just where sites exist but how they might be connected through ancient trade or communication routes.

## Planetary Geology and the Search for Extraterrestrial Heritage

The tools of space archaeology have an obvious extension: the study of other planetary bodies. NASA and other space agencies have accumulated petabytes of imagery from Mars, the Moon, and asteroids — bodies that may preserve evidence of ancient processes, including potentially ancient life. While no one expects to find Greek inscriptions on Mars, the geological and morphological methods of space archaeology are directly applicable to planetary science.

AI is already being used to analyze imagery from Mars rovers and orbiters, searching for patterns that might indicate past aqueous activity, organic chemistry, or biological processes. The Perseverance rover's sample caching mission — collecting rocks for eventual return to Earth — relies on AI-assisted targeting to identify the most scientifically valuable samples. As we explore more of the solar system, AI will be essential for processing the deluge of planetary data and identifying sites and features of interest.
