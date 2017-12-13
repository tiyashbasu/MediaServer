#include <iostream>
#include <vector>

using namespace std;

int solution(vector<int>& A) {
    auto n = A.size() + 1;

    int sumOfElements = 0;
    for (const auto& element : A) {
        sumOfElements += element;
    }

    return static_cast<int>(n * (n + 1) / 2 - sumOfElements);
}

int main() {
    vector<int> vec{2, 3, 1, 5};
    cout << solution(vec) << endl;
}