# Explore AI in Big Data: Spark, Ray & Distributed ML at Scale

## Overview

Big Data refers to datasets that exceed the capacity of traditional database systems to capture, store, manage, and analyze within a reasonable time. The AI revolution has dramatically increased data volumes (training data, feature stores, embeddings) while simultaneously demanding new infrastructure to train and serve AI models on these datasets. Three platforms dominate the modern distributed computing landscape for AI: **Apache Spark** (the incumbent general-purpose engine), **Ray** (the emerging ML-focused distributed computing framework from UC Berkeley's RISELab), and cloud-native distributed ML platforms from **AWS SageMaker**, **Google Vertex AI**, and **Azure ML**.

The defining challenge of AI + Big Data is the **GPU-TPU bottleneck** — compute has scaled faster than memory bandwidth and inter-node networking, making efficient data loading, sharding, and pipelining as important as algorithmic improvements.

## Key Technologies

**Apache Spark for AI at Scale**
- **Spark MLlib**: Built-in ML library supporting distributed training of classification, regression, clustering, and recommendation algorithms. Handles petabyte-scale feature engineering via Spark SQL.
- **Databricks** (the company founded by Spark's creators) has added **Photon** (vectorized query engine), **Lakehouse AI** (MLflow integration), and **Serverless GPU** clusters for distributed model training.
- **Spark Structured Streaming**: Handles near-real-time feature computation for online ML systems.
- **Delta Lake** and **Apache Iceberg**: Open-table formats that enable ML training jobs to read consistent snapshots of data lake data with schema enforcement.

**Ray (RISELab / Anyscale)**
- **Ray Core**: Distributed task scheduling and actors for arbitrary Python code.
- **Ray Tune**: Hyperparameter tuning at scale (PBT, ASHA, population-based training).
- **Ray Train**: Distributed model training (PyTorch, TensorFlow, Horovod) with fault tolerance.
- **Ray Serve**: Low-latency model serving with adaptive batching.
- **Ray Data**: Distributed data loading and preprocessing pipeline, replacing Spark for ML-specific workloads in many organizations.
- **Anyscale Endpoints**: Managed Ray clusters for LLM inference at scale.

**Distributed ML Training**
- **FSDP** (Fully Sharded Data Parallel) — Meta's technique for sharding model parameters across GPUs/nodes, enabling training of trillion-parameter models.
- **Alpa**: Automatic parallelization of JAX/Flax models across distributed hardware.
- **DeepSpeed** (Microsoft): Optimization suite for distributed training including ZeRO (Zero Redundancy Optimizer) stages 1–3 and 3D parallelism.
- **NVIDIA Merlin**: End-to-end framework for recommender system training and serving at billion-scale.

**Feature Stores & Data Pipelines for ML**
- **Feast** (gojek/Feast): Open-source feature store supporting online (Redis) and offline (Spark/Iceberg) serving.
- **Tecton**: Managed feature store with automatic feature computation and monitoring.
- **Hopsworks**: ML-centric data platform with integrated feature store and model registry.

## Current State

Spark remains the **workhorse** for data preprocessing and ETL at enterprise scale; Databricks and AWS EMR are the dominant managed platforms. However, for ML-specific workloads, Ray is gaining significant traction because of its Python-native design, fine-grained task scheduling, and tighter integration with modern ML libraries (PyTorch, JAX).

Distributed training of models with 100B+ parameters now requires sophisticated infrastructure (DeepSpeed, FSDP, gradient checkpointing) that only organizations with dedicated ML platform teams can operate efficiently. The democratization of this capability via managed services (SageMaker, Vertex AI, Anyscale) is an ongoing transition.

**State of the field:**
- Petabyte-scale feature stores are operational at Netflix, Uber, and LinkedIn.
- Ray Serve handles millions of inference requests per day at scale for production LLM applications.
- Spark 3.5 (released 2024) includes native GPU scheduling and RAPIDS integration for dataframe operations.

## Real-World Applications

**Netflix** runs **Apache Spark** for its recommendation system at petabyte scale, processing 500M+ daily user events to update recommendation models. Spark Structured Streaming computes near-real-time features fed into online neural networks.

**Uber** uses **Ray** for its Michelangelo ML platform, particularly for online prediction serving and A/B test analysis at scale. Ray's fault-tolerant task scheduling handles thousands of concurrent model inference requests.

**LinkedIn** applies **Spark MLlib** and custom gradient-boosting implementations for its "People You May Know" recommendation engine, processing graph edges across 900M+ users.

**OpenAI** (and most LLM labs) use **DeepSpeed** and **Ray** to train models with hundreds of billions of parameters across thousands of GPU nodes. Microsoft Azure's ML platform is optimized for this workload.

**Spotify** uses **Ray Data** to preprocess audio features for its recommendation models, replacing Spark for ML-specific pipelines and reducing preprocessing latency by 60%.

## Challenges

- **GPU memory fragmentation**: Training large models across many nodes requires careful memory management; tensor parallelism and pipeline parallelism add significant engineering complexity.
- **Distributed ML debugging**: Fault tolerance in distributed training is partial — GPU crashes can lose hours of training progress without proper checkpointing.
- **Cold-start for feature stores**: Maintaining consistency between offline (batch) and online (real-time) feature computation remains a hard engineering problem.
- **Resource heterogeneity**: Modern GPU clusters mix A100s, H100s, and L4s; efficient scheduling across heterogeneous hardware is unsolved for many workloads.
- **Data shuffling bottleneck**: Distributed ML training spends 30–50% of time in data movement; network bandwidth is often the limiting factor, not compute.

## Future Directions

- **Unified batch/streaming/ML data plane**: Platforms like **Apache Beam 3.0** and **Delta Lake 3.0** aim to provide a single API for batch, streaming, and ML feature computation.
- **Serverless distributed ML**: Platforms like **Anyscale Serverless** and **AWS Lambda for ML** abstract away cluster management entirely, charging per-second of compute.
- **Model-aware data loading**: AI models that guide their own data loading (learning which data is most informative, akin to active learning) to reduce the cost of massive-scale training.
- **Hardware-software co-design**: Custom ASICs (Trainium, Groq, TPU v5) and novel interconnects (NVLink, Infinity Band) designed specifically for distributed ML at scale.

## References

- Zaharia et al., "Ray: A Distributed Framework for Emerging AI Applications" — OSDI 2018
- Moriaty et al., "Apache Spark 3.5: GPU Acceleration and RAPIDS Integration" — Spark+AI Summit 2024
- Rajbhandari et al., "ZeRO: Memory Optimizations Toward Training Trillion Parameter Models" — SC 2020
- Nuti et al., "Amazon SageMaker: A Machine Learning Platform" — Amazon Science (2023)
- Liang et al., "Feast: A Feature Store for Machine Learning" — GitHub/Feast Project (2020)
- Anyscale Blog: "Ray at Scale: Production ML on Ray" (2024)
- Databricks Blog: "Lakehouse AI: Bringing ML to the Data Lake" (2024)
