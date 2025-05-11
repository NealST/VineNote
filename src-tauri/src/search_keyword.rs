use rayon::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use std::path::{Path, PathBuf};
use std::sync::{Arc, Mutex};
use walkdir::WalkDir;

#[derive(Debug, Serialize, Deserialize)]
pub struct SearchResult {
    file_path: String,
    matches: Vec<MatchContent>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MatchContent {
    text: String,
    node: Value,  // 存储完整的父节点
}

pub fn search_files(root_dir: &Path, keyword: &str) -> Result<Vec<SearchResult>, Box<dyn std::error::Error>> {
    let files: Vec<PathBuf> = WalkDir::new(root_dir)
        .into_iter()
        .filter_map(|e| e.ok())
        .filter(|e| e.path().extension().map_or(false, |ext| ext == "json"))
        .map(|e| e.path().to_owned())
        .collect();

    let results = Arc::new(Mutex::new(Vec::new()));

    files.par_iter().for_each(|file_path| {
        if let Ok(content) = std::fs::read_to_string(file_path) {
            if let Ok(json_content) = serde_json::from_str::<Vec<Value>>(&content) {
                let matches = search_in_json(&json_content, keyword);
                if !matches.is_empty() {
                    let mut results = results.lock().unwrap();
                    results.push(SearchResult {
                        file_path: file_path.to_string_lossy().into_owned(),
                        matches,
                    });
                }
            }
        }
    });

    Ok(Arc::try_unwrap(results).unwrap().into_inner()?)
}

fn search_in_json(json_content: &[Value], keyword: &str) -> Vec<MatchContent> {
    let mut matches = Vec::new();
    
    fn process_node(node: &Value, parent_node: Option<&Value>, keyword: &str, matches: &mut Vec<MatchContent>) {
        match node {
            Value::Object(obj) => {
                // 检查是否包含 text 字段
                if let Some(text) = obj.get("text") {
                    if let Some(text_str) = text.as_str() {
                        if text_str.to_lowercase().contains(&keyword.to_lowercase()) {
                            // 如果找到匹配的文本，使用父节点（如果有的话）或当前节点
                            matches.push(MatchContent {
                                text: text_str.to_string(),
                                node: parent_node.unwrap_or(node).clone(),
                            });
                        }
                    }
                }
                
                // 递归处理 children 字段
                if let Some(children) = obj.get("children") {
                    if let Some(children_array) = children.as_array() {
                        for child in children_array {
                            // 传递当前节点作为父节点
                            process_node(child, Some(node), keyword, matches);
                        }
                    }
                }
            }
            Value::Array(arr) => {
                for item in arr {
                    process_node(item, None, keyword, matches);
                }
            }
            _ => {}
        }
    }

    process_node(&Value::Array(json_content.to_vec()), None, keyword, &mut matches);
    matches
}
