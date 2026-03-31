// src/lib.rs
//! Single-File Agent Memory Skill - Memvid-based memory for AI agents
//! 
//! This library provides a zero-infrastructure, ultra-low-latency memory solution
//! for AI agents using the memvid-core library.

use memvid_core::{Memvid, PutOptions, SearchRequest, Error as MemvidError};
use std::path::Path;

/// Agent Memory Skill
/// 
/// Provides persistent, single-file memory for AI agents
pub struct AgentMemory {
    memvid: Memvid,
}

impl AgentMemory {
    /// Create a new agent memory file
    pub fn create<P: AsRef<Path>>(path: P) -> Result<Self, MemvidError> {
        let memvid = Memvid::create(path)?;
        Ok(AgentMemory { memvid })
    }

    /// Open an existing agent memory file
    pub fn open<P: AsRef<Path>>(path: P) -> Result<Self, MemvidError> {
        let memvid = Memvid::open(path)?;
        Ok(AgentMemory { memvid })
    }

    /// Add content to memory with optional metadata
    pub fn add(&mut self, content: &str, title: Option<&str>, tags: &[&str]) -> Result<(), MemvidError> {
        let mut opts = PutOptions::builder();
        if let Some(title) = title {
            opts = opts.title(title);
        }
        for tag in tags {
            opts = opts.tag("tag", tag);
        }
        self.memvid.put(content.as_bytes(), opts.build())?;
        self.memvid.commit()?;
        Ok(())
    }

    /// Search memory for content
    pub fn search(&self, query: &str, top_k: usize) -> Result<Vec<String>, MemvidError> {
        let request = SearchRequest {
            query: query.to_string(),
            top_k,
            ..Default::default()
        };
        let response = self.memvid.search(request)?;
        
        // Convert results to strings
        let mut results = Vec::with_capacity(response.results.len());
        for result in response.results {
            results.push(String::from_utf8_lossy(&result.content).to_string());
        }
        Ok(results)
    }

    /// Get memory timeline (for debugging and analysis)
    pub fn timeline(&self) -> Result<Vec<String>, MemvidError> {
        // This would be implemented with memvid's timeline features
        // For now, return empty vector
        Ok(vec![])
    }
}

/// Convenience function for creating memory from string content
pub fn create_memory_from_content<P: AsRef<Path>>(path: P, content: &str) -> Result<(), MemvidError> {
    let mut mem = AgentMemory::create(path)?;
    mem.add(content, Some("Initial content"), &["initial"])?;
    Ok(())
}