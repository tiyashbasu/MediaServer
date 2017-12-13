#include <iostream>
#include <limits>
#include <vector>

using namespace std;

int solution(vector<int>& A) {
    auto n = A.size();

    long sumA = A[0];
    long sumB = 0;

    for (int i = 1; i < n; ++i) {
        sumB += A[i];
    }

    long minSum = abs(sumA - sumB);

    for (int i = 1; i < n - 1; ++i) {
        sumA += A[i];
        sumB -= A[i];

        minSum = min(minSum, abs(sumA - sumB));
    }

    return static_cast<int>(minSum);
}

int main() {
    vector<int> vec{-1000, 1000};
    cout << solution(vec) << endl;
}