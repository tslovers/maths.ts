/**
 * @author Hector J. Vasquez <ipi.vasquez@gmail.com>
 *
 * @licence
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Vertex from './Vertex';
import {weightFunc} from './Graph';


/**
 * Represents an edge of a graph. It must provides a source, a destination
 * and optionally a weight and name.
 */
export default class Edge {
  private weightFunction: weightFunc;

  /**
   * Builds this with respective source, destination, weight(optional) and
   * name(optional).
   * @param _source The source of this.
   * @param _destination The destination of this.
   * @param weight The weight for this. It may be the result of a function
   * or just a number.
   * @param info Additional name for this.
   */
  constructor(private _source: Vertex, private _destination: Vertex,
              weight?: number | weightFunc, public info?: any) {
    if (typeof weight === 'number') {
      this.weight = weight;
    } else {
      this.setWeightFunction(weight);
    }
    this.info = info;
  }

  private _weight: number;

  /**
   * Returns the weight of this edge. If weight is given by a function it
   * executes such function. If there is no weight defined it returns 1.
   * If the weight is given by a number it just returns the number.
   * @return The weight associated to this edge.
   */
  get weight(): number {
    if (this.weightFunction) {
      return this.weightFunction(this.source, this.destination);
    } else if (this._weight === undefined) {
      return 1;
    } else {
      return this._weight;
    }
  }

  /**
   * Sets a weight for this.
   * @param w The number to be the weight for this vertex.
   */
  set weight(w: number) {
    this._weight = w;
  }

  /**
   * Gets the origin point of this.
   * @return The source of this.
   */
  get source(): Vertex {
    return this._source;
  }

  /**
   * Sets the origin point for this.
   * @param value The vertex wanted to be the source of this edge.
   */
  set source(value: Vertex) {
    this._source = value;
  }

  /**
   * Gets the destination for this.
   * @return The destination of this.
   */
  get destination(): Vertex {
    return this._destination;
  }

  /**
   * Sets the destination for this.
   * @param value The new destination for this.
   */
  set destination(value: Vertex) {
    this._destination = value;
  }

  /**
   * Sets a weight function for this vertex.
   * @param f A function receiving the two vertex adjacent to this to
   * calculate weight for this.
   */
  public setWeightFunction(f: weightFunc) {
    this.weightFunction = f;
  }

  /**
   * Removes the weight function.
   */
  public removeWeightFunction() {
    this.weightFunction = undefined;
  }

  /**
   * Returns this as an coordinate: (source, destiny, weight).
   * @return The representation of this.
   */
  public toString() {
    return '(' + this.source.name + ', ' + this.destination.name +
      (this.weight !== undefined ? ', ' + this.weight : '') + ')';
  }
}
