# analyze_results.py
import pandas as pd
import matplotlib.pyplot as plt

def analyze_performance():
    # Load results
    base_results = pd.read_csv('base_results.jtl')
    cache_results = pd.read_csv('cache_results.jtl')
    kafka_results = pd.read_csv('kafka_results.jtl')
    
    # Create comparison plots
    plt.figure(figsize=(10, 6))
    plt.bar(['Base', 'With Cache', 'With Kafka'], 
            [base_results['elapsed'].mean(), 
             cache_results['elapsed'].mean(), 
             kafka_results['elapsed'].mean()])
    plt.title('Average Response Time Comparison')
    plt.ylabel('Time (ms)')
    plt.savefig('performance_comparison.png')

if __name__ == "__main__":
    analyze_performance()