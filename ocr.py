def _rand_initialize_weights(self, size_in, size_out):
    return [((x * 0.12) - 0.06) for x in np.random.rand(size_out, size_in)]

self.theta1 = self._rand_initialize_weights(400, num_hidden_nodes)
self.theta2 = self._rand_initialize_weights(num_hidden_nodes, 10)
self.input_layer_bias = self._rand_initialize_weights(1, num_hidden_nodes)
self.hidden_layer_bias = self._rand_initialize_weights(1, 10)


def _sigmoid_scalar(self, z):
        return 1 / (1 + math.e ** -z)

y1 = np.dot(np.mat(self.theta1), np.mat(data['y0']).T)
sum1 =  y1 + np.mat(self.input_layer_bias) # Add the bias
y1 = self.sigmoid(sum1)

y2 = np.dot(np.array(self.theta2), y1)
y2 = np.add(y2, self.hidden_layer_bias) # Add the bias
y2 = self.sigmoid(y2)