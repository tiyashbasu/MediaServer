#include <iostream>
#include <vector>

using namespace std;

vector<int> solution(vector<int>& A, int K) {
    auto n = A.size();
    vector<int> transformed(n);

    for (int i = 0; i < n; ++i) {
        transformed[(i + K) % n] = A[i];
    }

    return transformed;
}

int main() {
    vector<int> vec{3, 8, 9, 7, 6};
    int k = 3;
    auto sol = solution(vec,k);
    for (const auto& item : sol) {
        cout << item << ", ";
    }
}